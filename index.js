/* Trello Card ID Power-Up */

var ICON_URL = 'https://mrmP.github.io/TrelloCardID/icon.svg';

function formatId(num, pad) {
  var n = parseInt(num, 10);
  return (pad === 0 || pad === '0') ? String(n) : String(n).padStart(parseInt(pad, 10), '0');
}

function getLabel(t) {
  return Promise.all([
    t.get('card', 'shared', 'cardId'),
    t.get('board', 'shared', 'prefix'),
    t.get('board', 'shared', 'postfix'),
    t.get('board', 'shared', 'padding')
  ]).then(function(vals) {
    var cardId = vals[0], prefix = vals[1] || '', postfix = vals[2] || '';
    var pad = (vals[3] !== undefined && vals[3] !== null) ? vals[3] : 4;
    if (!cardId) return null;
    return prefix + formatId(cardId, pad) + postfix;
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
    return [{
      text: 'Card ID Settings',
      icon: { dark: ICON_URL, light: ICON_URL },
      callback: function(t) {
        return t.popup({
          title: 'Card ID Settings',
          url: t.signUrl('settings.html'),
          height: 320
        });
      }
    }];
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
    var pad = (res[1] !== undefined && res[1] !== null) ? res[1] : 4;
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
