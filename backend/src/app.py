from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS #CORS nos sirve para coordinar servidores. React crea su propio servidor para ir viendo los cambios aplicados y todo eso, por lo cual necesitamos coordinar el servidor de react con el de mongodb

from flask.json import JSONEncoder
from bson import json_util

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj): return json_util.default(obj)



app = Flask(__name__) #inicializamos flask
app.json_encoder = CustomJSONEncoder
app.config['MONGO_URI'] = 'mongodb://localhost/pythonreactdb'
mongo = PyMongo(app)#inicializamos pymongo

CORS(app)

db = mongo.db.users


#Ruta básica 
@app.route('/users', methods=['POST'])
def createUser():
    id = db.insert_one({
        'name': request.json['name'],
        'email': request.json['email'],
        'password': request.json['password']
    })
    return jsonify(id.inserted_id)

@app.route('/users', methods=['GET'])
def getUsers():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'name':doc['name'],
            'email': doc['email'],
            'password':doc['password']
        })

    return jsonify(users)

@app.route('/user/<id>', methods=['GET'])
def getUser(id):
    user = db.find_one({'_id':ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(user['_id'])),
        'name': user['name'],
        'email': user['email'],
        'password': user['password']
    })
    #return user

@app.route('/user/<id>', methods=['DELETE'])
def deleteUser(id):
    db.delete_one({'_id': ObjectId(id)})

    return jsonify({'msg': id+' user deleted'})

@app.route('/user/<id>', methods=['PUT'])
def updateUser(id):
    db.update_one({'_id': ObjectId(id)}, {'$set': {
        'name':request.json['name'],
        'email':request.json['email'],
        'password':request.json['password']
    }})
    return jsonify({'msg': id+' user updated'})

if __name__ == "__main__":
    app.run(debug=True)
