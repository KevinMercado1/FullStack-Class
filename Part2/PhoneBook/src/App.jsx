import { useState, useEffect } from 'react';
import personService from '../services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons))
      .catch(() => {
        showNotification('Failed to retrieve data from the server', 'error');
      });
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);
    const newPerson = { name: newName, number: newNumber };

    // Verifica si los campos están vacíos
    if (!newName || !newNumber) {
      showNotification('Name and number cannot be empty', 'error');
      return;
    }

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already in the phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(existingPerson.id, newPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            showNotification(`Updated ${newName}'s number`, 'success');
            setNewName('');
            setNewNumber('');
          })
          .catch((error) => {
            showNotification(
              `Information of ${newName} has already been removed from the server`,
              'error'
            );
            setPersons(
              persons.filter((person) => person.id !== existingPerson.id)
            );
          });
      }
    } else {
      personService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          showNotification(`Added ${newName}`, 'success');
          setNewName('');
          setNewNumber('');
        })
        .catch((error) => {
          showNotification(`Failed to add ${newName}`, 'error');
        });
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          showNotification(`Deleted ${name}`, 'error');
        })
        .catch(() => {
          showNotification(
            `Failed to delete ${name}. The entry might have been removed already.`,
            'error'
          );
        });
    }
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  // Filtra los nombres que contienen el texto del filtro
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <h2>PhoneBook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </>
  );
};

export default App;
