/* Trello Card ID Power-Up
 * Adds a unique sequential ID to each card with configurable prefix/postfix.
 * IDs are stored in card shared plugin data and displayed as badges.
 */

var PLUGIN_ID = 'card-id-powerup';

TrelloPowerUp.initialize({

  // Card badges — shown on the card face on the board
  'card-badges': function(t) {
    return t.get('card', 'shared', 'cardId').then(function(cardId) {
      if (!cardId) return [];
      return t.get('board', 'shared', 'prefix').then(function(prefix) {
        return t.get('board', 'shared', 'postfix').then(function(postfix) {
          var label = (prefix || '') + cardId + (postfix || '');
          return [{
            text: label,
            color: 'blue'
          }];
        });
      });
    });
  },

  // Card detail badges — shown inside the card detail view
  'card-detail-badges': function(t) {
    return t.get('card', 'shared', 'cardId').then(function(cardId) {
      if (!cardId) return [];
      return t.get('board', 'shared', 'prefix').then(function(prefix) {
        return t.get('board', 'shared', 'postfix').then(function(postfix) {
          var label = (prefix || '') + cardId + (postfix || '');
          return [{
            title: 'Card ID',
            text: label,
            color: 'blue'
          }];
        });
      });
    });
  },

  // Board button — opens settings
  'board-buttons': function(t) {
    return [{
      text: 'Card ID Settings',
      icon: {
        dark: 'https://cdn.glitch.global/trello-card-id/icon.svg',
        light: 'https://cdn.glitch.global/trello-card-id/icon.svg'
      },
      callback: function(t) {
        return t.popup({
          title: 'Card ID Settings',
          url: 'settings.html',
          height: 200
        });
      }
    }];
  },

  // Card button — manually assign ID if not yet assigned
  'card-buttons': function(t) {
    return t.get('card', 'shared', 'cardId').then(function(cardId) {
      if (cardId) return []; // Already has an ID
      return [{
        text: 'Assign Card ID',
        callback: function(t) {
          return assignCardId(t);
        }
      }];
    });
  },

  // on-enable: assign IDs to all existing cards
  'on-enable': function(t) {
    return t.board('id').then(function(board) {
      return t.cards('id', 'name').then(function(cards) {
        var promises = cards.map(function(card, index) {
          return t.get('card', 'shared', 'cardId', { card: card.id }).then(function(existing) {
            if (!existing) {
              return t.set('card', 'shared', 'cardId', String(index + 1).padStart(4, '0'), { card: card.id });
            }
          });
        });
        return Promise.all(promises);
      });
    });
  }
}, {
  appKey: '',  // Not needed for self-hosted manifest approach
  appName: 'Card ID Power-Up'
});

// Assign the next sequential ID to a card
function assignCardId(t) {
  return t.cards('id').then(function(allCards) {
    // Count how many cards already have IDs to determine next number
    var promises = allCards.map(function(card) {
      return t.get('card', 'shared', 'cardId', { card: card.id });
    });
    return Promise.all(promises).then(function(ids) {
      var maxId = 0;
      ids.forEach(function(id) {
        if (id) {
          var num = parseInt(id, 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      });
      var nextId = String(maxId + 1).padStart(4, '0');
      return t.set('card', 'shared', 'cardId', nextId).then(function() {
        return t.closePopup();
      });
    });
  });
}
