var updateSocketFunction;

angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {})

  .controller('LoginCtrl', function ($scope, $stateParams, $ionicPopup, $state, apiService) {
    $scope.updateTable = function () {
      apiService.getAllTable(function (data) {
        $scope.tables = data.data.data;
      })
    };
    $scope.updateTable();
    $scope.socketId = function () {
      io.socket.on('connect', function (socket) {
        $scope.socketIds = io.socket._raw.id;
        // console.log($scope.socketIds);
      });
    }
    $scope.socketId();
    $scope.submitLoginForm = function (data) {
      var id = $scope.socketIds;
      $.jStorage.set("tableId", data.tableId);
      apiService.doLogin(data, id, function (data) {
        // console.log(data);
        $scope.accessToken = data.data.data.accessToken[0];
        if ($scope.accessToken) {
          $.jStorage.set("dealerProfile", data);
          // console.log(data);
          $state.go("dealer");
        }
      });
    };
    $scope.tableId = $.jStorage.get("tableId");
    $.jStorage.flush();
  })
  .controller('HomeCtrl', function ($scope, $stateParams, $ionicPopup, $state) {
    $scope.youlose = function () {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: "Sorry",
        template: "You Lose",
        buttons: [{
          text: 'OK',
          // cssClass: 'leaveApp',
          onTap: function (e) {}
        }, ]
      });
    };

    $scope.youwin = function () {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: "Hurray",
        template: "You Won",
        buttons: [{
          text: 'OK',
          // cssClass: 'leaveApp',
          onTap: function (e) {}
        }, ]
      });
    };

    $scope.fold = function () {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: "Fold",
        template: "Your cards are folded",
        buttons: [{
          text: 'OK',
          // cssClass: 'leaveApp',
          onTap: function (e) {}
        }, ]
      });
    };

  })

  .controller('DealerCtrl', function ($scope, $stateParams, apiService, $state, $timeout, $ionicModal) {
    var tableId = $.jStorage.get("tableId");
    $scope.randomCard = function () {
      apiService.randomCard();
    };
    $scope.profile = $.jStorage.get("dealerProfile");
    var accessToken = $scope.profile.data.data.accessToken[0];
    $scope.socketId = function () {
      io.socket.on('connect', function (socket) {
        var socketIds = io.socket._raw.id;
        $scope.profile = $.jStorage.get("dealerProfile");
        var accessToken = $scope.profile.data.data.accessToken[0];
        apiService.connectSocket(accessToken, socketIds, function (data) {});
      });
    }
    $scope.socketId();
    if (!accessToken) {
      $state.go(login);
    }
    updateSocketFunction = function (data) {
      //  console.log("newGame", data);
      $scope.tableStatus = data.data.table;
      $scope.communityCards = data.data.communityCards;
      $scope.playersChunk = data.data.players;
      $scope.extra = data.extra;
      $scope.hasTurn = data.hasTurn;
      $scope.isCheck = data.isCheck;
      $scope.pots = data.data.pots;
      $scope.remainingPlayers = _.filter(data.data.players, function (n) {
        return (n.isActive && !n.isFold);
      }).length;
      $scope.$apply();
    };
    seatSelectionSocketFunction = function (data) {
      console.log("seatSelection", data.data);
      $scope.communityCards = data.data.communityCards;
      $scope.playersChunk = data.data.players;
      $scope.tableStatus = data.data.table;
      $scope.extra = data.extra;
      $scope.hasTurn = data.hasTurn;
      $scope.isCheck = data.isCheck;
      $scope.pots = data.data.pots;
      $scope.remainingPlayers = _.filter(data.data.players, function (n) {
        return (n.isActive && !n.isFold);
      }).length;
      $scope.$apply();
    }
    newGameSocketFunction = function (data) {
      $scope.communityCards = data.data.communityCards;
      $scope.playersChunk = data.data.players;
      $scope.tableStatus = data.data.table;
      $scope.extra = data.extra;
      $scope.hasTurn = data.hasTurn;
      $scope.isCheck = data.isCheck;
      $scope.pots = data.data.pots;
      $scope.$apply();
    }

    showWinnerSocketFunction = function (data) {
      $scope.pots = data.data.pots;
    }
    io.socket.on("Update", updateSocketFunction);
    io.socket.on("seatSelection", seatSelectionSocketFunction);
    io.socket.on("newGame", newGameSocketFunction);
    io.socket.on("showWinner", showWinnerSocketFunction);



    // $scope.pageChange = function () {};
    $scope.updatePlayers = function () {
      var tableId = $.jStorage.get("tableId");
      apiService.getAll(tableId, function (data) {
        console.log(data.data.data);
        $scope.communityCards = data.data.data.communityCards;
        $scope.playersChunk = data.data.data.players;
        $scope.extra = data.extra;
        $scope.hasTurn = data.hasTurn;
        $scope.isCheck = data.isCheck;
        $scope.remainingPlayers = _.filter(data.data.data.players, function (n) {
          return (n.isActive && !n.isFold);
        }).length;
      });
    };
    $scope.updatePlayers();
    $scope.showCards = function () {
      apiService.revealCards(function (data) {});
    };

    var count = 0;
    var counter = 0;
    $scope.selected = '0-0';

    $scope.currentPlayer = 0;




    // Modal Actions
    $ionicModal.fromTemplateUrl('templates/modal/sure.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.confirmModalClose = function () {
      $scope.modal.hide();
    };

    $scope.showConfirmationModal = function (value) {
      switch (value) {
        case "allIn":
          $scope.confirmModalOk = $scope.allIn;
          $scope.modelActionFor = "All In";
          break;
        case "fold":
          $scope.confirmModalOk = $scope.fold;
          $scope.modelActionFor = "Fold";
          break;
        case "newGame":
          $scope.confirmModalOk = $scope.newGame;
          $scope.modelActionFor = "Start New Game";
          break;
        case "undo":
          $scope.confirmModalOk = $scope.undo;
          $scope.modelActionFor = "Undo";
          break;
        case "makedealer":
          $scope.confirmModalOk = $scope.makeDealer;
          $scope.modelActionFor = "this player Dealer";
          break;
      }
      $scope.modal.show();
    };

    // Turn Actions
    $scope.allIn = function () {
      apiService.allIn(function (data) {});
    };
    $scope.fold = function () {
      apiService.fold(function (data) {});
    };
    $scope.raise = function () {
      apiService.raise(function (data) {});
    };
    $scope.move = function () {
      apiService.move(function (data) {});
    };
    $scope.call = function () {
      apiService.call(function (data) {});
    };
    $scope.check = function () {
      apiService.check(function (data) {});
    };

    // New Game
    $scope.newGame = function () {
      $state.go("table");
    };

    // Undo
    $scope.undo = function () {
      apiService.undo(function (data) {});
    };

    //makeDealer
    $scope.makeDealer = function (playerNo) {
      apiService.getAll(tableId, function (data) {
        if (data.data.data.table.status == "beforeStart") {
          apiService.makeDealerByDealer(tableId, playerNo, function (data) {
            // console.log(data);
          });
        }
      });
    }
    // Remove Cards
    $scope.removeCard = function (cardNo) {
      apiService.removeCard(cardNo);
    };
    $scope.showRemove = function (cardNo) {
      if ($scope.communityCards && $scope.communityCards.length == 8) {
        if (cardNo === 0) {
          if ($scope.communityCards[0].cardValue !== "" && $scope.communityCards[4].cardValue === "") {
            return true;
          }
        } else if (cardNo === 4) {
          if ($scope.communityCards[4].cardValue !== "" && $scope.communityCards[6].cardValue === "") {
            return true;
          }
        } else if (cardNo === 6) {
          if ($scope.communityCards[6].cardValue !== "") {
            return true;
          }
        }
      }
    };
  })

  .controller('TableCtrl', function ($scope, $stateParams, apiService, $state) {
    io.socket.off("Update", updateSocketFunction);
    $scope.newGame = function () {
      $scope.winnerData = {};
      apiService.newGame(function (data) {
        $scope.updatePlayers();
      });
    };

    $scope.newGame();
    $scope.tableId = $.jStorage.get("tableId");
    $scope.updatePlayers = function () {
      apiService.getAll(tableId, function (data) {
        // console.log(data);
      });
    };


    $scope.makeDealer = function (tabId) {
      apiService.makeDealer({
        "tabId": tabId,
        straddle: $scope.form.straddle,
        removeSmallBlind: $scope.form.removeSmallBlind
      }, function (data) {
        $state.go("dealer");
      });
    };

    $scope.activePlayers = function () {
      var players = _.flatten($scope.playersChunk);

      var activePlayers = _.filter(players, function (player) {
        return player.isActive;
      });
      $scope.maxStraddle = _.times(activePlayers.length - 3, function (n) {
        return n + 1;
      });
      return activePlayers;
    };

    $scope.isDealerPlayerInActive = function (dealerPlayer) {
      var players = _.flatten($scope.playersChunk);
      var dealerPlayerIndex = _.findIndex(players, function (player) {
        return (player.isActive && player.playerNo == dealerPlayer);
      });
      if (dealerPlayerIndex >= 0) {
        return true;
      } else {
        return false;
      }
    };
    $scope.form = {
      straddle: 0,
      adminurl: apiService.getAdminUrl(),
      removeSmallBlind: false,
    };

    //Settings
    apiService.getSettings(function (data) {
      $scope.settings = data.data.results;
    });
    $scope.storeSetting = function () {
      apiService.storeSettings($scope.settings, function () {});
    };

    $scope.settingShow = false;
    $scope.toggleSettingShow = function () {
      $scope.settingShow = !$scope.settingShow;
    };

    $scope.saveAdminUrl = function () {
      apiService.saveAdminUrl($scope.form.adminurl);
      window.location.href = window.location.href.split("#")[0];
    };

    $scope.showRemoveSmallBlind = function () {
      // console.log($scope.dealer.dealerPlayer);
      var nextPlayer = (parseInt($scope.dealer.dealerPlayer) + 1) % 8;
      // console.log(nextPlayer);
      if ($scope.allPlayers[nextPlayer - 1].isActive === false) {
        return true;
      } else {
        return false;
      }

    };



  })

  .controller('WinnerCtrl', function ($scope, $stateParams, apiService) {
    io.socket.off("Update", updateSocketFunction);
    $scope.showWinner = function () {
      apiService.showWinner(function (data) {
        $scope.players = data.data.data.winners;
        $scope.winners = _.filter($scope.players, function (player) {
          return player.winner;
        });
        $scope.communityCards = data.data.data.communityCards;
        $scope.winnerString = _.join(_.map($scope.winners, function (n) {
          return "Player-" + n.playerNo;
        }), " , ");
      });
    };
    $scope.showWinner();
    $scope.showPlayerCard = function (player) {
      player.showCard = true;
      apiService.showPlayerCard(player, function (data) {

      });
    };

  });