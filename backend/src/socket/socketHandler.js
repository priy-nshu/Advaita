const { Server } = require('socket.io');
const { DatabaseService } = require('../services/database.service');

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.db = DatabaseService.getInstance();
    this.matchmakingQueue = new Map();
    this.activeGames = new Map();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        this.handleDisconnect(socket);
      });

      // Matchmaking events
      socket.on('joinMatchmaking', (playerData) => {
        this.handleJoinMatchmaking(socket, playerData);
      });

      socket.on('leaveMatchmaking', () => {
        this.handleLeaveMatchmaking(socket);
      });

      // Game events
      socket.on('submitAnswer', (answerData) => {
        this.handleAnswerSubmission(socket, answerData);
      });
    });
  }

  handleDisconnect(socket) {
    // Remove from matchmaking queue if present
    this.matchmakingQueue.delete(socket.id);
    
    // Handle active game if any
    const game = this.activeGames.get(socket.id);
    if (game) {
      this.handleGameEnd(game, 'opponent_disconnected');
    }
  }

  handleJoinMatchmaking(socket, playerData) {
    this.matchmakingQueue.set(socket.id, {
      socket,
      playerData,
      timestamp: Date.now()
    });

    this.tryMatchPlayers();
  }

  handleLeaveMatchmaking(socket) {
    this.matchmakingQueue.delete(socket.id);
  }

  tryMatchPlayers() {
    const players = Array.from(this.matchmakingQueue.values());
    
    // Sort by waiting time
    players.sort((a, b) => a.timestamp - b.timestamp);

    // Try to match players
    for (let i = 0; i < players.length - 1; i++) {
      const player1 = players[i];
      const player2 = players[i + 1];

      // Check if players are within acceptable ELO range
      if (this.isMatchValid(player1.playerData, player2.playerData)) {
        this.createGame(player1, player2);
        i++; // Skip the next player as they're now matched
      }
    }
  }

  isMatchValid(player1, player2) {
    const eloDiff = Math.abs(player1.eloRating - player2.eloRating);
    return eloDiff <= 200; // Within 200 ELO points
  }

  createGame(player1, player2) {
    const gameId = `game_${Date.now()}`;
    const game = {
      id: gameId,
      players: [player1.socket.id, player2.socket.id],
      scores: { [player1.socket.id]: 0, [player2.socket.id]: 0 },
      currentQuestion: null,
      startTime: Date.now()
    };

    // Store game in active games
    this.activeGames.set(player1.socket.id, game);
    this.activeGames.set(player2.socket.id, game);

    // Remove players from matchmaking queue
    this.matchmakingQueue.delete(player1.socket.id);
    this.matchmakingQueue.delete(player2.socket.id);

    // Notify players of match
    player1.socket.emit('matchFound', { gameId, opponent: player2.playerData });
    player2.socket.emit('matchFound', { gameId, opponent: player1.playerData });

    // Start the game
    this.startGame(game);
  }

  startGame(game) {
    // Send first question to both players
    this.sendQuestion(game);
  }

  async sendQuestion(game) {
    // TODO: Implement question fetching from database
    const question = {
      id: 'q1',
      question: 'What is the capital of France?',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      correctAnswer: 1
    };

    game.currentQuestion = question;
    game.currentQuestionStartTime = Date.now();

    // Send question to both players
    game.players.forEach(playerId => {
      const socket = this.io.sockets.sockets.get(playerId);
      if (socket) {
        socket.emit('question', question);
      }
    });
  }

  handleAnswerSubmission(socket, answerData) {
    const game = this.activeGames.get(socket.id);
    if (!game) return;

    const { questionId, answer, timeTaken } = answerData;
    const isCorrect = answer === game.currentQuestion.correctAnswer;

    // Update score
    if (isCorrect) {
      game.scores[socket.id] += 100;
    }

    // Notify opponent of answer
    const opponentId = game.players.find(id => id !== socket.id);
    const opponentSocket = this.io.sockets.sockets.get(opponentId);
    if (opponentSocket) {
      opponentSocket.emit('opponentAnswer', {
        isCorrect,
        timeTaken
      });
    }

    // Check if both players have answered
    if (this.allPlayersAnswered(game)) {
      this.handleRoundEnd(game);
    }
  }

  allPlayersAnswered(game) {
    // TODO: Implement proper answer tracking
    return true;
  }

  handleRoundEnd(game) {
    // TODO: Implement round end logic
    this.sendQuestion(game);
  }

  handleGameEnd(game, reason) {
    // Calculate winner
    const [player1Id, player2Id] = game.players;
    const player1Score = game.scores[player1Id];
    const player2Score = game.scores[player2Id];
    const winner = player1Score > player2Score ? player1Id : player2Id;

    // Notify players of game end
    game.players.forEach(playerId => {
      const socket = this.io.sockets.sockets.get(playerId);
      if (socket) {
        socket.emit('gameEnd', {
          winner,
          reason,
          finalScores: game.scores
        });
      }
    });

    // Clean up game
    game.players.forEach(playerId => {
      this.activeGames.delete(playerId);
    });
  }
}

module.exports = SocketHandler; 