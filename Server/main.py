from flask import Flask,jsonify,request
from flask_ngrok import run_with_ngrok
import requests
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app= Flask(__name__)
CORS(app)
# run_with_ngrok(app) 

uri = "mongodb+srv://rahdnus119:rahdnus@cluster0.z2nzpia.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db=client.Lecter
loginCol=db.Login
healthCol=db.Health
recordCol=db.ChatRecords

@app.route('/')
def home():
  return {"result":"Hello World"}

@app.route('/generate',methods= ['POST'])
def generateResponse():
    input_text=request.json['input']
    return jsonify({"text":"result"})

@app.route('/store',methods= ['POST'])
def storeMentalHealth():
    return jsonify({"text":"Successfully Stored"})

@app.route('/eval',methods = ['POST'])
def evaluateMentalHealth():
    return jsonify({"result":1})

@app.route('/signIn',methods = ['POST'])
def signIn():
    mailID=request.json['mailid']
    password=request.json['password']
    res=loginCol.find_one({'mail':mailID})
    if res==None:
        return jsonify({"result":"Check Mail or Password"})
    elif res['password']!=password:
        return jsonify({"result":"Incorrect Password"})
    else:
      chatRecord=recordCol.find_one({'mail':f"{mailID}"})
      healthRecord=healthCol.find_one({'mail':f"{mailID}"})
      return jsonify({"result":1,"message":"Welcome Back. How are you doing today?"})



@app.route('/signUp',methods = ['POST'])
def signUp():
    mailID=request.json['mailid']
    password=request.json['password']
    res=loginCol.find_one({'mail':mailID})
    print(mailID)
    print(password)
    print(res)
    if res!=None and loginCol.count_documents(res)!=0:
      return jsonify({"result":"Mail already exists"})
    else :
      loginCol.insert_one({'mail':mailID,'password':password})
      healthCol.insert_one({'mail':mailID,'Anxiety':0,'Depressed':0,'Bipolar':0,'ADHD':0,'currentDiagnosis':"Generic"})
      recordCol.insert_one({'mail':mailID,'record':"This is the User's visit to the therapist AI"})
      return jsonify({"result":1,"message":"Welcome. Please feel free to talk to me about any problems you might be facing."})

# Running app
if __name__ == '__main__':
    app.run()