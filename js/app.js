/*global app, $on */
(() => {
  "use strict";

  /**
   * Sets up a brand new Todo list.
   *
   * @param {string} name The name of your new to do list.
   */
  class Todo {
    constructor(name) {
      this.storage = new app.Store(name);
      this.model = new app.Model(this.storage);
      this.template = new app.Template();
      this.view = new app.View(this.template);
      this.controller = new app.Controller(this.model, this.view);
    }
  }

  /**
   * new instance of todo is set
   * given the name todos-vanillajs
   */

  const todo = new Todo("todos-vanillajs");

  /**
   * setView function sets the view depending on the url hash
   * called in 2 instances
   * when the window loads and when the hash changes
   */
  const setView = () => {
    todo.controller.setView(document.location.hash);
  };
  $on(window, "load", setView);
  $on(window, "hashchange", setView);
})();
