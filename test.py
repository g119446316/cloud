#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask import url_for, redirect, flash
from flask import Flask, request, abort, render_template, jsonify ,session
from flask_socketio import SocketIO, emit
from flask_socketio import ConnectionRefusedError
import json
from datetime import timedelta
from redis import Redis
from random import randint
from base64 import b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

app = Flask(__name__,static_url_path="/templates", static_folder='/home/nvidia/tmp/templates')
redis = Redis(host='0.0.0.0',port=6379)

app.config['SECRET_KEY'] = 'secret!'
#app.secret_key = config.get('flask', 'secret_key')

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"
login_manager.login_view = 'login'
login_manager.login_message = 'check one two'

socketio = SocketIO(app,cors_allowed_origins='*')
#socketio = SocketIO(app)

data={}
device_total_ip={'ip':['0.0.0.0']}

class User(UserMixin):
    pass

@login_manager.user_loader
def user_loader(user_id):
    if user_id not in users:
        return

    user = User()
    user.id = user_id
    return user

@login_manager.request_loader
def request_loader(request):
    user_id = request.form.get('user_id')
    if user_id not in users:
        return

    user = User()
    user.id = user_id

    # DO NOT ever store passwords in plaintext and always compare password
    # hashes using constant-time comparison!
    user.is_authenticated = request.form['password'] == users[user_id]['password']

    return user

users = {'nvidia': {'password': 'nvidia'}}


@app.route("/stats", methods=['POST'])
def upload():
    #data = request.get_json()
    #print(data)

    #get device ip
    ip_addr = str(request.remote_addr)

    if ip_addr.encode('utf-8') not in redis.lrange("device_ip", 0, redis.llen("device_ip")):
       redis.rpush("device_ip",ip_addr)

    #get psutil or jtop info and aes decode
    data = request.data
    print(data)
    """key = bytes([0,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6])
    cipher = AES.new(key, AES.MODE_ECB)
    data = cipher.decrypt(data)"""
    data = unpad(data, AES.block_size)
    #data = b64decode(data)
    data = json.loads(data)
    print(data)


    #socketio.emit('device_ip',device_total_ip)
    socketio.emit(ip_addr,data)

    redis.rpush(ip_addr,json.dumps(data))
    #print(redis.lrange(ip_addr, 0, redis.llen(ip_addr)))

    return "POST Success"

@app.route("/ws-control")
def wscontrol():
    return render_template('ws-control.html')

@app.route("/dmsip", methods=['GET','POST'])
def dmsip():
    print(request.data)
    return 'ok'



@app.route("/jtop-nano")
def jtop():
    return render_template('web-analytics-real-time.html', async_mode= None)

@app.route("/history-nano")
def historyhtml():
    return render_template('history-nano.html')

@app.route("/history-data", methods=['POST'])
def historydata():
    ip_address = str(request.form['ip'])
    datetime = str (request.form['time'])
    print(ip_address,datetime)
    history_redis = redis.lrange(ip_address, 0, redis.llen(ip_address))
    history_list = []
    for i in range(len(history_redis)):
        if datetime in history_redis[i].decode('utf-8'):
           history_list.append(json.loads(history_redis[i].decode('utf-8')))
    for i in range(history_list.count({})):
        history_list.remove({})
    print(len(history_list))
    return jsonify({'data': history_list})

@app.route("/psutil-nano")
@login_required
def psutil():
    print(redis.lrange("device_ip", 0, redis.llen("device_ip")))
    return render_template('psutil-real-time.html')

@app.route("/deviceip")
def deviceip():
    deviceip_list = redis.lrange("device_ip", 0, redis.llen("device_ip"))
    deviceip_dict = {'device_ip':[]}
    for i in range(redis.llen("device_ip")):
        deviceip_dict['device_ip'].append(deviceip_list[i].decode('utf-8'))
    print(deviceip_dict)
    return deviceip_dict


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template("login.html")
    
    user_id = request.form['user_id']
    if (user_id in users) and (request.form['password'] == users[user_id]['password']):
        user = User()
        user.id = user_id
        login_user(user)
        return redirect(url_for('psutil'))

    flash('登入失敗了...')
    return render_template('login.html')

@app.route('/logout')
def logout():
    user_id = current_user.get_id()
    logout_user()
    return render_template('login.html')


if __name__ == "__main__":
    socketio.run(app,host='0.0.0.0',port=5000,debug=True)
