/* Trello Card ID Power-Up
 * Adds a unique sequential ID to each card with configurable prefix/postfix.
 * IDs are stored in card shared plugin data and displayed as badges.
 */

var ICON_URL = 'https://mrmP.github.io/TrelloCardID/icon.svg';

TrelloPowerUp.initialize({

  // Card badges — shown on the card face on the board
  'card-badges': function(t) {
    return t.get('card', 'shared', 'cardId').then(function(cardId) {
      if (!cardId) return [];
      return Promise.all([
        t.get('board', 'shared', 'prefix'),
        t.get('board', 'shared', 'postfix')
      ]).then(function(vals) {
        return [{ text: (vals[0] || '') + cardId + (vals[1] || ''), color: 'blue' }];
      });
    });
  },

  // Card detail badges — shown inside the card detail view
  'card-detail-badges': function(t) {
    return t.get('card', 'shared', 'cardId').then(function(cardId) {
      if (!cardId) return [];
      return Promise.all([
        t.get('board', 'shared', 'prefix'),
        t.get('board', 'shared', 'postfix')
      ]).then(function(vals) {
        return [{ title: 'Card ID', text: (vals[0] || '') + cardId + (vals[1] || ''), color: 'blue' }];
      });
    });
  },

  // Card back section — shows settings panel inside the card detail view
  'card-back-section': function(t) {
    return {
      title: 'Card ID',
      icon: ICON_URL,
      content: {
        type: 'iframe',
        url: t.signUrl('card-section.html'),
        height: 120
      }
    };
  },

  // Board buttons — Assign All IDs
  'board-buttons': function(t) {
    return [
      {
        text: 'Assign All Card IDs',
        icon: { dark: ICON_URL, light: ICON_URL },
        callback: function(t) {
          return t.popup({
            title: 'Assign IDs to All Cards',
            url: 'assign-all.html',
            height: 160
          });
        }
      }
    ];
  },

  // Card button — manually assign ID if not yet assigned
  'card-buttons': function(t) {
    return t.get('card', 'shared', 'cardId').then(function(cardId) {
      if (cardId) return [];
      return [{
        text: 'Assign Card ID',
        callback: function(t) {
          return assignNextId(t);
        }
      }];
    });
  }

}, {
  appKey: '2e23b655e062b3728cc2635e6f537b97',
  appName: 'Card ID Power-Up'
});

// Assign the next sequential ID to the current card
function assignNextId(t) {
  return t.cards('id').then(function(allCards) {
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
