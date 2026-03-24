/* Trello Card ID Power-Up */

var ICON_URL = 'https://mrmP.github.io/TrelloCardID/icon.svg';

function formatId(num, pad) {
  var n = parseInt(num, 10);
  var p = (pad !== undefined && pad !== null) ? parseInt(pad, 10) : 4;
  return p === 0 ? String(n) : String(n).padStart(p, '0');
}

function getLabel(t) {
  return Promise.all([
    t.get('card', 'shared', 'cardId'),
    t.get('board', 'shared', 'prefix'),
    t.get('board', 'shared', 'postfix'),
    t.get('board', 'shared', 'padding')
  ]).then(function(vals) {
    if (!vals[0]) return null;
    return (vals[1] || '') + formatId(vals[0], vals[3]) + (vals[2] || '');
  });
}

TrelloPowerUp.initialize({

  'card-badges': function(t) {
    return getLabel(t).then(function(label) {
      if (!label) return [];
      return [{ text: label, color: 'blue' }];
    });
  },

  'card-detail-badges': function(t) {
    return getLabel(t).then(function(label) {
      if (!label) return [];
      return [{ title: 'Card ID', text: label, color: 'blue' }];
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

  'board-buttons': function(t) {
    return [
      {
        text: 'Card ID Settings',
        icon: { dark: ICON_URL, light: ICON_URL },
        callback: function(t) {
          return t.popup({
            title: 'Card ID Settings',
            url: 'settings.html',
            height: 320
          });
        }
      },
      {
        text: 'Debug Card IDs',
        icon: { dark: ICON_URL, light: ICON_URL },
        callback: function(t) {
          return t.popup({
            title: 'Card ID Debug',
            url: 'debug.html',
            height: 300
          });
        }
      }
    ];
  },

  'card-buttons': function(t) {
    return t.get('card', 'shared', 'cardId').then(function(cardId) {
      if (cardId) return [];
      return [{
        text: 'Assign Card ID',
        callback: function(t) { return assignNextId(t); }
      }];
    });
  }

}, {
  appKey: '2e23b655e062b3728cc2635e6f537b97',
  appName: 'Card ID Power-Up'
});

function assignNextId(t) {
  return Promise.all([
    t.cards('id'),
    t.get('board', 'shared', 'padding')
  ]).then(function(res) {
    var allCards = res[0];
    var promises = allCards.map(function(card) {
      return t.get('card', 'shared', 'cardId', { card: card.id });
    });
    return Promise.all(promises).then(function(ids) {
      var maxId = 0;
      ids.forEach(function(id) {
        if (id) { var n = parseInt(id, 10); if (!isNaN(n) && n > maxId) maxId = n; }
      });
      return t.set('card', 'shared', 'cardId', String(maxId + 1)).then(function() {
        return t.closePopup();
      });
    });
  });
}
