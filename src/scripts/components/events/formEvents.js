import { createCard, getCards, updateCard } from '../../../api/cardData';
import { addCategory, updateCategory } from '../../../api/categoryData';
import addCardForm from '../forms/addCardForm';
import { renderCards } from '../pages/myCards';
import categoryFilter from '../pages/navFilter';

const formEvents = (user) => {
  document.querySelector('#form-div').addEventListener('submit', (e) => {
    e.preventDefault();
    // CREATE CARD
    if (e.target.id.includes('create-card')) {
      const cardObj = {
        category: document.querySelector('#select-category').value,
        description: document.querySelector('#description').value,
        title: document.querySelector('#title').value,
        isPublic: document.querySelector('#isPublic').checked,
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        date: new Date().toLocaleString(),
        dateData: Date.now()
      };
      createCard(cardObj, user.uid).then((cardsArr) => {
        renderCards(cardsArr, user.uid);
      });
    }
    // UPDATE CARD
    if (e.target.id.includes('update-card')) {
      const [, firebaseKey] = e.target.id.split('--');
      const cardObj = {
        category: document.querySelector('#select-category').value,
        description: document.querySelector('#description').value,
        title: document.querySelector('#title').value,
        isPublic: document.querySelector('#isPublic').checked,
        firebaseKey,
        uid: user.uid
      };
      updateCard(cardObj).then((cardsArray) => renderCards(cardsArray, user.uid));
    }
    if (e.target.id.includes('add-category')) {
      const newCategory = document.querySelector('#newCategory').value;
      if (newCategory[newCategory.length - 1] !== '-') {
        console.warn(newCategory);
        const catObj = {
          name: newCategory,
          uid: user.uid
        };
        addCategory(catObj, user.uid).then(() => {
          addCardForm(user.uid, {});
        });
      } else {
        // eslint-disable-next-line no-alert
        window.alert("Categories can't end in '-'");
      }
    }
    if (e.target.id.includes('edit-category')) {
      const [, firebaseKey, name] = e.target.id.split('--');
      const catEdit = document.querySelector('#newCategory').value;
      if (catEdit[catEdit.length - 1] !== '-') {
        const catObj = {
          name: catEdit
        };
        const cardObj = {
          category: document.querySelector('#newCategory').value
        };
        getCards(user.uid).then((cardsArr) => {
          const cardEdit = cardsArr.filter((card) => card.category === name);
          const updateCards = cardEdit.map((item) => updateCard(cardObj, item.firebaseKey));
          Promise.all(updateCards).then(() => {
            updateCategory(firebaseKey, catObj).then(() => {
              categoryFilter(user.uid, catObj.name, firebaseKey);
            });
          });
        });
      } else {
        // eslint-disable-next-line no-alert
        window.alert("Categories can't end in '-'");
      }
    }
  });
  document.querySelector('#form-div').addEventListener('click', (e) => {
    if (e.target.id === 'cancel-edit') {
      document.getElementById('myCardsBtn').click();
    }
    if (e.target.id.includes('cancel-edit-category')) {
      const [, name, firebaseKey] = e.target.id.split('--');
      categoryFilter(user.uid, name, firebaseKey);
    }
  });
};

export default formEvents;
