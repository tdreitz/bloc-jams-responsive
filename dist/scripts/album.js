var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ 'mp3' ],
    preload: true
  });

  var seek = function(time) {
    if (currentSoundFile) {
      currentSoundFile.setTime(time);
    }
  };

  var setVolume = function(volume) {
    if (currentSoundFile) {
      currentSoundFile.setVolume(volume);
    }
  };

  seek();

  setVolume(currentVolume);

  currentSoundFile.play();
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber,songTitle,songDuration) {
  var template = 
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songTitle + '</td>'
  + '  <td class="song-item-duration">' + songDuration + '</td>'
  + '</tr>'
  ;

  var $row = $(template);
  
  var clickHandler = function() {
    var $songNumTableCell = $(this).find('.song-item-number');
    var $songNumber = $songNumTableCell.attr('data-song-number');

    var updatePlayerBarSong = function() {
      var playerBarInfo = $('.player-bar h2');
      playerBarInfo.eq(0).html(currentAlbum.artist + ' – ' + currentSongFromAlbum.name);
      playerBarInfo.eq(1).html(currentSongFromAlbum.name);
      playerBarInfo.eq(2).html(currentAlbum.artist);

      $('.main-controls .play-pause').html(playerBarPauseButton);
    };
    
    if (currentlyPlayingSongNumber === null) {
      $songNumTableCell.html(pauseButtonTemplate);
      setSong($songNumber);
      updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === parseInt($songNumber)) {
      $songNumTableCell.html(playButtonTemplate);
      if (!currentSoundFile.isPaused()) {
        currentSoundFile.pause();
      } else {
        currentSoundFile.play();
      }
      $('.main-controls .play-pause').html(playerBarPlayButton);
    } else if (currentlyPlayingSongNumber !== parseInt($songNumber)) {
      $songNumTableCell.html(pauseButtonTemplate);
      var $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
      $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
      setSong($songNumber);
      updatePlayerBarSong();
    }

    updateSeekBarWhileSongPlays();
  };
  
  var onHover = function() {
    var $getElem = $(this).find('.song-item-number');
    var $getElemData = parseInt($getElem.attr('data-song-number'));
    
    if ($getElemData !== currentlyPlayingSongNumber) {
      $getElem.html(playButtonTemplate);
    }
  };
  
  var offHover = function() {
    
    var $getElem = $(this).find('.song-item-number');
    var $getElemData = parseInt($getElem.attr('data-song-number'));
    
    if($getElemData !== currentlyPlayingSongNumber) {
      $getElem.html($getElemData);
    }
  };
  
  $row.click(clickHandler);
  $row.hover(onHover,offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  
  currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.name);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    $albumSongList.append($newRow);
  }
};

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;

  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();

    var seekBarFillRatio = offsetX / barWidth;

    updateSeekPercentage($(this), seekBarFillRatio);

    seek();
  });

  $seekBars.find('.thumb').mousedown(function(event) {

    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();

      var seekBarFillRatio = offsetX / barWidth;

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });

    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {
  if (currentSongFromAlbum === null) {
    return
  }

  var getLastSongNumber = function(index) {
    return index === 0 ? currentAlbum.songs.length : index;
  };

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;
  console.log(currentSongIndex);

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  setSong(currentSongIndex + 1);
  updateSeekBarWhileSongPlays();

  $('.currently-playing .song-name').text(currentSongFromAlbum.name);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentAlbum.artist + " - " + currentSongFromAlbum.name);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
  if (currentlyPlayingSongNumber === null) {
    return
  }

  var getLastSongNumber = function(index) {
      return index === (currentAlbum.songs.length -1) ? 1 : index + 2;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    console.log(currentSongIndex);
    currentSongIndex--;

    if (currentSongIndex < 0) {
      currentSongIndex = currentAlbum.songs.length - 1;
    }

    setSong(currentSongIndex + 1);
    updateSeekBarWhileSongPlays();

    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentAlbum.artist + " - " + currentSongFromAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function() {
  if (!currentSoundFile.isPaused()) {
    currentSoundFile.pause();
    $playPause.html(playerBarPlayButton);
    getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);

  } else {
    currentSoundFile.play();
    $playPause.html(playerBarPauseButton);
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
  }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"><span>';
var playerBarPauseButton = '<span class="ion-pause"><span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 100;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

$(document).ready(function() {

  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playPause.click(togglePlayFromPlayerBar);
  setupSeekBars();
}); 

