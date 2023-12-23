from flask import Flask, jsonify, request
import redis
import json

app = Flask(__name__)
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)


def append_details(existing_details, new_details):
    for key, value in new_details.items():
        if key in existing_details:
            # If the key already exists and is a list, append the value to the list
            if isinstance(existing_details[key], list):
                existing_details[key].append(value)
            else:
                # If the key exists but is not a list, convert it to a list and append the value
                existing_details[key] = [existing_details[key], value]
        else:
            # If the key does not exist, create a new list with the value
            existing_details[key] = [value]
    return existing_details
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
                # Convert single values to lists
                details = {key: [value] if not isinstance(value, list) else value for key, value in details.items()}
                key_values.append({
                    'item': item_name,
                    'details': details,
                })
        inventory[key.decode('utf-8')] = key_values

    return jsonify({'inventory': inventory})
@app.route('/locatii', methods=['GET'])
def get_locatii_coords():
    try:
        locatii_data = redis_client.hgetall("Locatii")
        locatii_coords = {}
        
        for location, details_str in locatii_data.items():
            details = json.loads(details_str.decode('utf-8'))
            locatii_coords[location.decode('utf-8')] = details.get('coords', '')
        
        return jsonify(locatii_coords)
    
    except Exception as e:
        print(f"Error fetching Locatii coordinates: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
@app.route('/api/add/<location>/<item_name>', methods=['POST'])
def add_item(location, item_name):
    details_str = request.json.get('details', '')
    
    if not details_str:
        return jsonify({'status': 400, 'message': 'Details are required'})

    details = json.loads(details_str)

    # Get existing details for the specified location and item name
    existing_details_str = redis_client.hget(location, item_name)

    if existing_details_str:
        existing_details = json.loads(existing_details_str.decode('utf-8'))
        # Append new details to the existing ones
        existing_details = append_details(existing_details, details)
    else:
        existing_details = details

    # Store updated details in a hash named 'items'
    redis_client.hset(location, item_name, json.dumps(existing_details))

    return jsonify({'status': 200, 'message': f'{item_name} added/appended to the database'})

@app.route('/api/locatii/<location>', methods=['POST'])
def new_location(location):
    details_str = request.json.get('details', '')
    if not details_str:
        return jsonify({'status': 400, 'message': 'Details are required'})

    details = json.loads(details_str)

    # Get existing details for the specified location
    existing_details_str = redis_client.hget("Locatii", location)

    if existing_details_str:
        existing_details = json.loads(existing_details_str.decode('utf-8'))
        # Append new details to the existing ones
        existing_details = append_details(existing_details, details)
    else:
        existing_details = details

    # Store updated details in a hash named 'Locatii'
    redis_client.hset("Locatii", location, json.dumps(existing_details))

    return jsonify({'status': 200, 'message': f'{location} has been added/appended to the database'})

if __name__ == '__main__':
    app.run(debug=True)



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

