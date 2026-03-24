# Trello Card ID Power-Up

A Trello Power-Up that assigns a unique sequential ID to every card, with configurable prefix and postfix per board.

## Features

- 🔢 Auto-assigns sequential IDs to cards (e.g. `0001`, `0002`, ...)
- 🏷️ Configurable **prefix** and **postfix** per board (e.g. `PROJ-0001-2024`)
- 📌 IDs shown as **badges** on card faces and inside card detail view
- ⚙️ Settings accessible via board button
- 🔄 Existing cards can be assigned IDs manually via card button

## Setup

1. Enable **GitHub Pages** on this repo: `Settings → Pages → Source: main`
2. Register the Power-Up at [trello.com/power-ups/admin](https://trello.com/power-ups/admin)
3. Set the **connector URL** to:
   ```
   https://mrmP.github.io/TrelloCardID/connector.html
   ```
4. Add the Power-Up to your board

## Usage

- Cards created after enabling the Power-Up get IDs automatically
- Use the **"Card ID Settings"** board button to set prefix/postfix
- Use the **"Assign Card ID"** card button for cards without an ID

## ID Format

IDs are zero-padded 4-digit sequential numbers: `0001`, `0002`, etc.  
With prefix `PROJ-` and postfix `-Q1`: `PROJ-0001-Q1`
