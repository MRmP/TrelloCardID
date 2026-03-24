/* Trello Card ID Power-Up */

var ICON_URL = 'https://mrmP.github.io/TrelloCardID/icon.svg';

TrelloPowerUp.initialize({

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

  'card-back-section': function(t) {
    return {
      title: 'Card ID',
      icon: ICON_URL,
      content: {
        type: 'iframe',
        url: t.signUrl('card-section.html'),
        height: 110
      }
    };
  },

  // Single board button — opens settings (which also has bulk assign)
  'board-buttons': function(t) {
    return [{
      text: 'Card ID Settings',
      icon: { dark: ICON_URL, light: ICON_URL },
      callback: function(t) {
        return t.popup({
          title: 'Card ID Settings',
          url: 'settings.html',
          height: 280
        });
      }
    }];
  },

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

function assignNextId(t) {
  return t.cards('id').then(function(allCards) {
    var promises = allCards.map(function(card) {
      return t.get('card', 'shared', 'cardId', { card: card.id });
    });
    return Promise.all(promises).then(function(ids) {
      var maxId = 0;
      ids.forEach(function(id) {
        if (id) { var n = parseInt(id, 10); if (!isNaN(n) && n > maxId) maxId = n; }
      });
      return t.set('card', 'shared', 'cardId', String(maxId + 1).padStart(4, '0')).then(function() {
        return t.closePopup();
      });
    });
  });
}
