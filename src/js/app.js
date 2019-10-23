import { htmlToElement, insertElementAfter } from './utils';

export default class App {
  constructor() {
    this.input = document.getElementById('input');
    this.listRoot = document.getElementById('list-root');
    this.emptyState = document.getElementById('empty-state').cloneNode(true);

    this.initInput();
  }

  initInput() {
    this.input.addEventListener('keyup', e => {
      if (e.keyCode === 13) {
        this.addNewItem(e.target.value.trim());
      }
    });
  }

  addNewItem(itemName) {
    itemName = itemName.trim();

    if (itemName.length === 0) {
      return;
    }

    const addedTime = new Date().toLocaleString();

    const item = htmlToElement(`
    <li class="flex py-4 border-b border-gray-900 item">
      <div>
        <input type="checkbox">
      </div>
      <div class="flex-grow mx-4">
        <div class="text-gray-100 font-normal tracking-wide item-name">
          ${itemName}
        </div>
        <div class="text-gray-600 font-light text-xs mt-1 tracking-wide">
          Added: ${addedTime}
        </div>
      </div>
      <div>
        <button class="edit-button">
          <svg class="stroke-current text-gray-600 h-4" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="text-gray-600 text-2xl delete-button">&times;</button>
      </div>
    </li>
    `);

    item.getElementsByClassName('delete-button')[0].addEventListener('click', () => this.deleteItem(item));
    item.getElementsByClassName('edit-button')[0].addEventListener('click', () => this.editItem(item));

    this.listRoot.appendChild(item);
    this.evaluateEmptyState();
    this.input.value = '';
  }

  deleteItem(item) {
    item.remove();
    this.evaluateEmptyState();
  }

  editItem(item) {
    const oldItemName = item.getElementsByClassName('item-name')[0].innerHTML.trim();

    const editInput = htmlToElement(`
      <input type="text" value="${oldItemName}" placeholder="Enter new item name" class="bg-gray-800 px-4 py-2 rounded block w-full text-gray-200 font-light">
    `);

    editInput.addEventListener('keyup', e => {
      if (e.keyCode === 13) {
        this.performEdit(item, editInput)
      }
    });

    const itemNameEl = item.getElementsByClassName('item-name')[0];
    const editButtonEl = item.getElementsByClassName('edit-button')[0];

    insertElementAfter(editInput, itemNameEl);

    itemNameEl.classList.add('hidden');
    editButtonEl.classList.add('hidden');
  }

  performEdit(item, editInput) {
    const itemNameEl = item.getElementsByClassName('item-name')[0];
    const editButtonEl = item.getElementsByClassName('edit-button')[0];

    if (editInput.value.trim().length !== 0) {
      itemNameEl.innerHTML = editInput.value.trim();
    }

    editInput.remove();

    itemNameEl.classList.remove('hidden');
    editButtonEl.classList.remove('hidden');
  }

  evaluateEmptyState() {
    if (this.listRoot.getElementsByClassName('item').length === 0) {
      this.listRoot.appendChild(this.emptyState);
      return;
    }

    const emptyState = document.getElementById('empty-state');

    if (emptyState) {
      emptyState.remove();
    }
  }
}