from flask import Flask, jsonify, request
import redis
import json
import requests
import serial

app = Flask(__name__)
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)
#arduino_serial = serial.Serial('COM3', 9600, timeout=1) -> trbuie facut sa detecteze automat portu de arduino si BaudRateu, am eu cod "cata"
@app.route('/inventory', methods=['GET'])
def show_inventory():
    inventory = {}

    for key in redis_client.scan_iter():
        items = redis_client.hgetall(key)

        key_values = []

        for item, details_str in items.items():
            item_name = item.decode('utf-8')
            if details_str:
                    details = json.loads(details_str.decode('utf-8'))
                    key_values.append({
                        'item': item_name,
                        'count': details.get('count', 0),
                        'category': details.get('category', ''),
                        'size': details.get('size', ''),
            })
        inventory[key.decode('utf-8')] = key_values
    return jsonify({'inventory': inventory})



@app.route('/api/add/<location>/<item_name>', methods=['POST'])
def add_item(location,item_name):
    details_str = request.json.get('details', '')
    print(details_str)
    if not details_str:
        return jsonify({'status': 400, 'message': 'Details are required'})

    details = json.loads(details_str)
    
    # Store details in a hash named 'items'
    redis_client.hset(location, item_name, json.dumps(details))

    return jsonify({'status': 200, 'message': f'{item_name} added to the database'})

# @app.route('/characteristics/<item_name>', methods=['GET'])
# def show_characteristics(item_name):
#     characteristics_str = redis_client.hget(f'{item_name}_characteristics', 'characteristics')

#     if characteristics_str:
#         characteristics = json.loads(characteristics_str.decode('utf-8'))
#         return jsonify({'status': 200, 'characteristics': characteristics})
#     else:
#         return jsonify({'status': 404, 'message': f'Characteristics not found for {item_name}'})

# @app.route('/api/request/<item_name>/<item_size>', methods=['GET'])
# def request_item(item_name, item_size):
#     # Check the database for the specified item and size
#     key = f'{item_name}_{item_size}'
#     item_count = redis_client.hget('items', key)

#     if item_count:
#         # Item with specified size found, send "1" to Arduino
#         #arduino_serial.write(b'1')
#         return jsonify({'status': 200, 'message': f'Request for {item_name} ({item_size}) sent to Arduino'})
#     else:
#         return jsonify({'status': 404, 'message': f'Item not found for {item_name} ({item_size})'})
if __name__ == '__main__':
    app.run(debug=True)
