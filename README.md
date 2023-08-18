# TodoMVC codebase

This codebase implements the classic Todo application as an example project using best practices like separation of concerns, clean architecture, and testability.

## Overview

The application is split into three main layers:

### Model

- model.js - Responsible for data access and persistence

### View

- view.js - Handles all UI rendering and event handling
- template.js - Renders templates

### Controller

- controller.js - Connects model and view, coordinates application logic

## Model Layer

The model abstracts away the actual data storage behind a consistent interface. It supports:

- Creating, reading, updating and deleting items
- Aggregating data like item counts
- Interacting with different storage backends

## View Layer

The view handles all presentation logic:

- Renders templates and updates the DOM
- Wires up event handlers via delegated events
- Abstracts direct DOM access

## Template

Defines templates and helpers to render markup:

- Item, footer and other partial templates
- Data binding via placeholder replacement
- Output escaping to prevent XSS

## Controller

Coordinates the other layers by:

- Initializing storage and templates
- Exposing methods tied to UI events
- Calling model/view as needed

## Architecture Benefits

By separating concerns:

- Code is modular, reusable and testable
- Layers can be independently modified/replaced
- Consistent APIs isolate parts from each other

This provides a clean, structured base to build upon.
