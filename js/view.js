/*global qs, qsa, $on, $parent, $delegate */

(function (window) {
  "use strict";

  /**
   * View that abstracts away the browser's DOM completely.
   * It has two simple entry points:
   *
   *   - bind(eventName, handler)
   *     Takes a todo application event and registers the handler
   *   - render(command, parameterObject)
   *     Renders the given command with the options
   */
  class View {
    constructor(template) {
      this.template = template;

      this.ENTER_KEY = 13;
      this.ESCAPE_KEY = 27;

      this.$todoList = qs(".todo-list");
      this.$todoItemCounter = qs(".todo-count");
      this.$clearCompleted = qs(".clear-completed");
      this.$main = qs(".main");
      this.$footer = qs(".footer");
      this.$toggleAll = qs(".toggle-all");
      this.$newTodo = qs(".new-todo");
    }

    _removeItem(id) {
      let elem = qs('[data-id="' + id + '"]');

      if (elem) {
        this.$todoList.removeChild(elem);
      }
    }

    _clearCompletedButton(completedCount, visible) {
      this.$clearCompleted.innerHTML =
        this.template.clearCompletedButton(completedCount);
      this.$clearCompleted.style.display = visible ? "block" : "none";
    }

    _setFilter(currentPage) {
      qs(".filters .selected").className = "";
      qs('.filters [href="#/' + currentPage + '"]').className = "selected";
    }

    _elementComplete(id, completed) {
      let listItem = qs('[data-id="' + id + '"]');

      if (!listItem) {
        return;
      }

      listItem.className = completed ? "completed" : "";

      // In case it was toggled from an event and not by clicking the checkbox
      qs("input", listItem).checked = completed;
    }

    _editItem(id, title) {
      let listItem = qs('[data-id="' + id + '"]');

      if (!listItem) {
        return;
      }

      listItem.className = listItem.className + " editing";

      const input = document.createElement("input");
      input.className = "edit";

      listItem.appendChild(input);
      input.focus();
      input.value = title;
    }

    _editItemDone(id, title) {
      let listItem = qs('[data-id="' + id + '"]');

      if (!listItem) {
        return;
      }

      const input = qs("input.edit", listItem);
      listItem.removeChild(input);

      listItem.className = listItem.className.replace("editing", "");

      qsa("label", listItem).forEach(function (label) {
        label.textContent = title;
      });
    }

    render(viewCmd, parameter) {
      const self = this;
      const viewCommands = {
        showEntries() {
          self.$todoList.innerHTML = self.template.show(parameter);
        },
        removeItem() {
          self._removeItem(parameter);
        },
        updateElementCount() {
          self.$todoItemCounter.innerHTML =
            self.template.itemCounter(parameter);
        },
        clearCompletedButton() {
          self._clearCompletedButton(parameter.completed, parameter.visible);
        },
        contentBlockVisibility() {
          self.$main.style.display = self.$footer.style.display =
            parameter.visible ? "block" : "none";
        },
        toggleAll() {
          self.$toggleAll.checked = parameter.checked;
        },
        setFilter() {
          self._setFilter(parameter);
        },
        clearNewTodo() {
          self.$newTodo.value = "";
        },
        elementComplete() {
          self._elementComplete(parameter.id, parameter.completed);
        },
        editItem() {
          self._editItem(parameter.id, parameter.title);
        },
        editItemDone() {
          self._editItemDone(parameter.id, parameter.title);
        },
      };

      viewCommands[viewCmd]();
    }

    _itemId(element) {
      const li = $parent(element, "li");
      return parseInt(li.dataset.id, 10);
    }

    _bindItemEditDone(handler) {
      const self = this;
      $delegate(self.$todoList, "li .edit", "blur", function () {
        if (!this.dataset.iscanceled) {
          handler({
            id: self._itemId(this),
            title: this.value,
          });
        }
      });

      $delegate(self.$todoList, "li .edit", "keypress", function (event) {
        if (event.keyCode === self.ENTER_KEY) {
          // Remove the cursor from the input when you hit enter just like if it
          // were a real form
          this.blur();
        }
      });
    }

    _bindItemEditCancel(handler) {
      const self = this;
      $delegate(self.$todoList, "li .edit", "keyup", function (event) {
        if (event.keyCode === self.ESCAPE_KEY) {
          this.dataset.iscanceled = true;
          this.blur();

          handler({ id: self._itemId(this) });
        }
      });
    }

    bind(event, handler) {
      const self = this;
      if (event === "newTodo") {
        $on(self.$newTodo, "change", function () {
          handler(self.$newTodo.value);
        });
      } else if (event === "removeCompleted") {
        $on(self.$clearCompleted, "click", function () {
          handler();
        });
      } else if (event === "toggleAll") {
        $on(self.$toggleAll, "click", function () {
          handler({ completed: this.checked });
        });
      } else if (event === "itemEdit") {
        $delegate(self.$todoList, "li label", "dblclick", function () {
          handler({ id: self._itemId(this) });
        });
      } else if (event === "itemRemove") {
        $delegate(self.$todoList, ".destroy", "click", function () {
          handler({ id: self._itemId(this) });
        });
      } else if (event === "itemToggle") {
        $delegate(self.$todoList, ".toggle", "click", function () {
          handler({
            id: self._itemId(this),
            completed: this.checked,
          });
        });
      } else if (event === "itemEditDone") {
        self._bindItemEditDone(handler);
      } else if (event === "itemEditCancel") {
        self._bindItemEditCancel(handler);
      }
    }
  }

  // Export to window
  window.app = window.app || {};
  window.app.View = View;
})(window);
