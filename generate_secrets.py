import os
import random
import string

def generate_random_string(length):
    letters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(letters) for _ in range(length))

def save_to_file(content, filename):
    with open(filename, 'w') as file:
        file.write(content)

secret_key = generate_random_string(64)
users_db_password = generate_random_string(64)
users_db_root_password = generate_random_string(64)

save_to_file(secret_key, 'secrets/secret-key.txt')
save_to_file(users_db_password, 'secrets/users-db-password.txt')
save_to_file(users_db_root_password, 'secrets/users-db-root-password.txt')
