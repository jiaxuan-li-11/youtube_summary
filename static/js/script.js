let player;

// function createPlayer(videoId) {
//     var playerContainer = document.getElementById('youtube-player');
//     playerContainer.style.display = 'block';

//     // 只有当player不存在时才创建新的播放器
//     if (!player) {
//         player = new YT.Player('youtube-player', {
//             height: '315',
//             width: '560',
//             videoId: videoId,
//             events: {
//                 'onReady': onPlayerReady
//             }
//         });
//     } else {
//         // 如果player已经存在，只需要加载新的videoId
//         player.loadVideoById(videoId);
//     }
// }

// function onPlayerReady(event) {
//     var jumpButtons = document.querySelectorAll('.jump-btn');
//     jumpButtons.forEach(function(btn) {
//         btn.addEventListener('click', function() {
//             var time = Number(this.getAttribute('data-time'));
//             event.target.seekTo(time, true);
//         });
//     });
// }

// document.getElementById('submit-button').addEventListener('click', function() {
//     var videoId = document.getElementById('video-id').value;
//     // 不论player是否存在，只要videoId有效就调用createPlayer函数
//     if (videoId) {
//         createPlayer(videoId);
//     }
// });

// 当YouTube IFrame API准备就绪时，此函数将被调用

// var player;
let videoID;

function onYouTubeIframeAPIReady() {
    var submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', function() {
        videoID = document.getElementById('video-id').value;
        if (player) {
            // 如果播放器已存在，则更改视频ID
            player.loadVideoById(videoID);
        } else {
            // 创建一个新的播放器实例并加载视频
            player = new YT.Player('youtube-player', {
                height: '360',
                width: '560',
                videoId: videoID
            });
            document.getElementById('youtube-player').style.display = 'block';
            // document.getElementById('video-placeholder').style.display = 'none';
            document.getElementById('generate-summary').style.display = 'block';
            document.getElementById('summary-req').style.display = 'block';
        }
    });
}

// var loadingIcon = document.getElementById('loading-icon');

document.getElementById('generate-summary').addEventListener('click', function() {
    console.log(videoID);
    // this.disabled = true; // 禁用按钮
    // loadingIcon.style.display = 'block';

    // console.log(loadingIcon);

    fetch('/generate_summary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({videoID: videoID})
    })
    .then(response => response.json())
    .then(data => {
        // 清空容器现有内容
        var container = document.getElementById('summary-result');
        container.innerHTML = '';
    
        // 添加摘要数据
        data.forEach(item => {
            var summaryElement = document.createElement('div');
            summaryElement.classList.add('summary-item');
            summaryElement.innerHTML = `
                <span class="timestamp" data-timestamp="${Math.floor(item.start)}">${item.start}</span>
                <p class="summary-text">${item.text}</p>
            `;
            container.appendChild(summaryElement);
        });
    
        // 添加点击事件监听器
        var timestamps = container.querySelectorAll('.timestamp');
        timestamps.forEach(function(timestamp) {
            timestamp.addEventListener('click', function() {
                var time = this.getAttribute('data-timestamp');
                // var player = document.getElementById('youtube-player');
                // 假设您已经有了控制YouTube播放器的逻辑
                player.seekTo(time, true);
            });
        });
    })
    .catch((error) => {
        // loadingIcon.style.display = 'none';
        console.error('Error:', error);
    });
});
