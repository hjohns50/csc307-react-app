// src/MyApp.js
import React, {useState, useEffect} from 'react';
import Table from './Table';
import Form from './Form';

function MyApp() {

    const [characters, setCharacters] = useState([]);
    
    function removeOneCharacter(index, userId) {
        fetch(`/users/${userId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status === 204) {
                const updated = characters.filter((character, i) => {
                    return i !== index;
                });
                setCharacters(updated);
                console.log('User deleted successfully!');
            } else if (response.status === 404) {
                console.error('User not found. Status code: ' + response.status);
            } else {
                console.error('Failed to delete user. Status code: ' + response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function updateList(person) { 
        postUser(person)
          .then(() => setCharacters([...characters, person]))
          .catch((error) => {
            console.log(error);
          })
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }
    
    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
      }, [] );
    
    function postUser(person) {
        const promise = fetch("Http://localhost:8000/users", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
                body: JSON.stringify(person),
            })
            .then(response => {
                if (response.status === 201) {
                    return response.json();
                } else {
                    console.error('Failed to create user. Status code: ' + response.status);
                    throw new Error('Failed to create user');
                }
            })
            .then(data => {
                console.log('User created successfully:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
            return promise;
    }

    return (
        <div className="container">
            <Table characterData={characters} 
	            removeCharacter={removeOneCharacter} />
            <Form handleSubmit={updateList} />        
        </div>
    ) 
}

export default MyApp;