from flask import Flask,jsonify,request
import tensorflow as tf
from tensorflow import keras
import numpy as np
from transformers import BertTokenizer
from flask_ngrok import run_with_ngrok
import requests
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app= Flask(__name__)
CORS(app)
run_with_ngrok(app) 

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

sentiment_model = tf.keras.models.load_model('Lecter_Mental_Health_Model_MK3')
tokenizer = BertTokenizer.from_pretrained('bert-base-cased')

def prepare_data(input_text, tokenizer):
        token = tokenizer.encode_plus(
            input_text,
            max_length=256,
            truncation=True,
            padding='max_length',
            add_special_tokens=True,
            return_tensors='tf'
        )
        return {
            'input_ids': tf.cast(token.input_ids, tf.float64),
            'attention_mask': tf.cast(token.attention_mask, tf.float64)
        }

def make_prediction(model, processed_data, classes=['ADHD', 'Anxiety', 'Autism', 'Bipolar', 'Depressed']):
        probs = model.predict(processed_data)[0]
        return classes[np.argmax(probs)]

@app.route('/')
def home():
  return {"result":"Hello World"}

@app.route('/store',methods= ['POST'])
def storeMentalHealth():
    input_text=request.json['input']
    print(input_text)
    processed_data = prepare_data(input_text, tokenizer)
    result = make_prediction(sentiment_model, processed_data=processed_data)
    mailID=request.json['mailid']
    filter = { 'mail': f'{mailID}' }
    # Values to be updated.
    newvalues = { "$inc": { f'{result}': 1 } }
    print(filter)
    print(newvalues)
    health.update_one(filter, newvalues)
    
    return jsonify({"text":"Successfully Stored"})

@app.route('/eval',methods = ['POST'])
def evaluateMentalHealth():
    mailID=request.json['mailid']
    #get stats from db
    healthResult=health.find_one({'mail':f'{mailID}'})
    #find max
    print(healthResult)
    result = max(zip(healthResult.values(), healthResult.keys()))[1]
    print(result)
    #return result
    return jsonify({"result":result})

@app.route('/signIn',methods = ['POST'])
def signIn():
    mailID=request.json['mail']
    password=request.json['password']
    res=loginCol.find_one({'mail':mailID,'password':password})
    if loginCol.count_documents(res)==0:
      return jsonify({"result":"Check Mail or Password"})
    else :
      return jsonify({"result":1})

@app.route('/signUp',methods = ['POST'])
def signUp():
    mailID=request.json['mail']
    password=request.json['password']
    res=loginCol.find_one({'mail':mailID})
    if loginCol.count_documents(res)!=0:
      return jsonify({"result":"Mail already exists"})
    else :
      loginCol.insert_one({'mail':mailID,'password':password})
      healthCol.insert_one({'mail':mailID,'Anxiety':0,'Depressed':0,'Bipolar':0,'ADHD':0,'Autism':0})
      return jsonify({"result":1})

# Running app
if __name__ == '__main__':
    app.run()