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
def get_locatii_data():
    try:
        locatii_data = redis_client.hgetall("Locatii")
        locatii_info = {}

        for location, details_str in locatii_data.items():
            details = json.loads(details_str.decode('utf-8'))
            items_data = redis_client.hgetall(location.decode('utf-8'))

            key_values = []
            for item, item_details_str in items_data.items():
                item_name = item.decode('utf-8')
                if item_details_str:
                    item_details = json.loads(item_details_str.decode('utf-8'))
                    key_values.append({
                        'item': item_name,
                        'count': item_details.get('count', 0),
                        'category': item_details.get('category', ''),
                        'culoare': item_details.get('color', ''),
                        'size': item_details.get('size', ''),
                    })

            coords = details.get('coords', '')
            coords_list = list(map(float, coords.split(', '))) if coords else []

            locatii_info[location.decode('utf-8')] = {
                'coords': coords_list,
                'items': key_values,
            }

        return jsonify(locatii_info)

    except Exception as e:
        print(f"Error fetching Locatii data: {e}")
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
        # Check if existing details match the new details (name, category, color, and size)
        if (
            existing_details.get('item_name') == details.get('item_name') and
            existing_details.get('category') == details.get('category') and
            existing_details.get('color') == details.get('color') and
            existing_details.get('size') == details.get('size')
        ):
            # If they match, increment the count
            existing_details['count'] += int(details.get('count', 1)) 
        else:
            # If they don't match, treat it as a new item
            return jsonify({'status': 200, 'message': f'{item_name} is a new item. Add it as needed.'})

    else:
        existing_details = details

    # Store updated details in a hash named 'items'
    redis_client.hset(location, item_name, json.dumps(existing_details))

    return jsonify({'status': 200, 'message': f'{item_name} added/appended to the database'})



@app.route('/api/locatii/<location>', methods=['POST', 'GET'])
def new_location(location):
    if request.method == 'POST':
        try:
            details_str = request.json.get('details', '')
            if not details_str:
                return jsonify({'status': 400, 'message': 'Details are required'})

            details = json.loads(details_str)

            # Check if 'coords' key exists in details
            coords_str = details.get('coords', '')

            try:
                # Try to convert coordinates to a list of floats
                coords_list = list(map(float, coords_str.split(','))) if coords_str else []
            except ValueError:
                # Handle the case where coordinates cannot be converted to floats
                return jsonify({'status': 400, 'message': 'Invalid coordinates format'})

            # Check if the location name already has coordinates
            existing_coords_str = redis_client.hget("Locatii", location)
            if existing_coords_str:
                return jsonify({'status': 400, 'message': f'{location} already exists'})

            # Add new details with coordinates to the Redis database
            new_details = {'coords': coords_list, **details}
            redis_client.hset("Locatii", location, json.dumps(new_details))

            return jsonify({'status': 200, 'message': f'{location} has been added to the database with coordinates'})
        except Exception as e:
            print(f"Error processing new location: {e}")
            return jsonify({'status': 500, 'message': 'Internal Server Error'})

    elif request.method == 'GET':
        # You can handle the GET request to retrieve data here
        locatii_data = redis_client.hgetall("Locatii")
        locatii_info = {}

        for loc, coords_str in locatii_data.items():
            coords = json.loads(coords_str.decode('utf-8')).get('coords', '')
            coords_list = list(map(float, coords.split(','))) if coords else []
            locatii_info[loc.decode('utf-8')] = {'coords': coords_list}

        return jsonify(locatii_info)

    else:
        return jsonify({'status': 405, 'message': 'Method Not Allowed'}), 405

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

