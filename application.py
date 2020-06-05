import datetime, os

from flask import Flask, render_template, session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channel1=[]
users={}

@app.route("/")
def index():
	return render_template("index.html",channel1=channel1)

@socketio.on("submit message")
def message(data):
	currentDT = datetime.datetime.now()
	newMessage = (data["author"], data["newMessage"], currentDT.strftime("%Y-%m-%d %H:%M:%S"))
	channel1.append(newMessage)
	if len(channel1)> 50:
		channel1.pop(0)
	emit("announce message", {"newMessage": newMessage}, broadcast=True)

@socketio.on("user connected")
def userLogin(data):
	currentDT = datetime.datetime.now()
#	session["user_id"]=data.
#	session["name"]=name
	newLogin = (data["userName"], currentDT.strftime("%Y-%m-%d %H:%M:%S"))
	emit("announce login", {"newLogin": newLogin}, broadcast=True)