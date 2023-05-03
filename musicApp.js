window.onload = function () {
    //封装ajax函数
    function resolveData(data) {
        let arr = []
        for (let k in data) {
            let str = k + '=' + data[k]
            arr.push(str)
        }

        return arr.join('&')
    }
    // let res = resolveData({ name: 'zs', age: 20 })
    // console.log(res);
    function myAjax(options) {
        let xhr = new XMLHttpRequest()

        //把外界传递过来的参数对象，转换为 查询字符串
        let qs = resolveData(options.data)

        // 判断请求类型
        if (options.method.toUpperCase() === 'GET') {
            //发起GEt请求
            xhr.open(options.method, options.url + '?' + qs)
            xhr.send()
        } else if (options.method.toUpperCase() === 'POST') {
            //发起POST请求
            xhr.open(options.method, options.url)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            xhr.send(qs)
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let result = JSON.parse(xhr.responseText)
                options.success(result)
            }
        }
        // return result
    };

    //测试GET
    // myAjax({
    //     method: 'GET',
    //     url: 'http://www.liulongbin.top:3006/api/getbooks',
    //     data: {
    //         id: 1
    //     },
    //     success: function (res) {
    //         console.log(res)
    //     }
    // });

    //测试POST 
    // myAjax({  
    //     method: 'POST',
    //     url: 'http://www.liulongbin.top:3006/api/getbooks',
    //     data: {
    //         bookname: '白夜行',
    //         author: '东野圭吾',
    //         publisher: '霓虹图书出版社(bushi)'
    //     },
    //     success: function (res) {  //好像不是很行
    //         console.log(res)
    //     }
    // });



    // 轮播图模块
    (function () {// 轮播图模块
        let slideImg = document.querySelector('.slide-wrap img')
        // let slideImgSrc = slideImg.getAttribute('src')
        let arr = []
        const slideLi = document.querySelectorAll('.slide-li')

        function getComment() {
            $.ajax({
                method: "GET",
                url: "http://47.120.38.121:3000/banner?type=0",
                success: function (date) {
                    // console.log(date);
                    // console.log(date.tags[0])
                    // console.log(slideImg)
                    // console.log(slideLi)
                    // slideImg.src = date.banners[0].imageUrl
                    for (let i = 0; i < date.banners.length; i++) {
                        arr[i] = date.banners[i].imageUrl
                    }
                    // console.log(arr)
                }
            })
        }
        // 调用获取数据接口函数
        getComment()
        //1.经过小圆点切换图片
        for (let i = 0; i < slideLi.length; i++) {
            slideLi[i].addEventListener('mouseenter', function () {
                // console.log(11)
                slideImg.src = arr[i]
                document.querySelector('.slide-footer .active').classList.remove('active')
                slideLi[i].classList.add('active')
            })
        }
        // 2.点击左右侧按钮切换图片
        const btnRight = document.querySelector('.btn-right')
        const btnLeft = document.querySelector('.btn-left')
        let i = 0//信号量 控制播放张数
        // 右边
        btnRight.addEventListener('click', function () {
            // console.log(11)
            i++
            //判断条件
            i = i > 9 ? 0 : i
            //得到对应链接
            // console.log(arr[i])
            //渲染数据
            toggle()
        })
        // 左边
        btnLeft.addEventListener('click', function () {
            // console.log(11)
            i--
            //判断条件
            i = i < 0 ? 9 : i
            //得到对应链接
            // console.log(arr[i])
            //渲染数据
            toggle()
        })
        //渲染数据函数
        function toggle() {
            //渲染数据
            slideImg.src = arr[i]
            document.querySelector('.slide-footer .active').classList.remove('active')
            slideLi[i].classList.add('active')
        }
        // 3.自动播放定时器
        let timeId = setInterval(function () {
            btnRight.click()
        }, 2000)
        // 4.鼠标经过停止定时器
        const slideWrap = document.querySelector('.slide-wrap')
        slideWrap.addEventListener('mouseover', function () {
            clearInterval(timeId)
        })
        // 5.鼠标离开开启定时器
        slideWrap.addEventListener('mouseleave', function () {
            clearInterval(timeId)
            //开
            timeId = setInterval(function () {
                btnRight.click()
            }, 1000)
        })
        // 6.点击图片弹出警告
        slideImg.addEventListener('click', function () {
            alert("都说了现在不能看了辣！要好好看下面的'注意'哦!")
        })
    })();

    // 热门歌单模块
    (function () {
        // 1.获取数据
        // 
        // async function getDate(address) {
        //     const xhr = new XMLHttpRequest()
        //     let arr = {}
        //     //设置响应体数据类型
        //     xhr.responseType = 'json'
        //     //初始化
        //     // xhr.open('GET', 'https://musicapi.lhbbb.xyz/artist/top/song?id=6452')
        //     xhr.open('GET', address)
        //     // 发送
        //     xhr.send()
        //     xhr.onreadystatechange = await function () {
        //         if (xhr.readyState === 4) {
        //             if (xhr.status >= 200 && xhr.status < 300) {
        //                 // console.log(xhr.status)
        //                 // cnsole.log(xhr.statusText)
        //                 // console.log(xhr.getAllResponseHeaders())//没有响应头
        //                 // console.log(xhr.response)
        //                 // arr = xhr.response.result
        //                 // for (let i = 0; i < xhr.response.length; i++) {
        //                 //     arr[i].push = xhr.response.result[i]
        //                 // }
        //                 // console.log(arr)
        //                 let res = xhr.response
        //                 return res
        //             }
        //         }
        //     }
        // }
        // let arr = getDate('https://musicapi.lhbbb.xyz/personalized')
        // console.log(getDate('https://musicapi.lhbbb.xyz/personalized'))

        // 获取热门歌单
        const xhr = new XMLHttpRequest()
        const List = document.querySelector('.list')
        let arr = {}

        let recomList=[]

        //设置响应体数据类型
        xhr.responseType = 'json'
        //初始化
        xhr.open('GET', 'http://47.120.38.121:3000/personalized')
        // 发送
        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // console.log(xhr.status)
                    // cnsole.log(xhr.statusText)
                    // console.log(xhr.getAllResponseHeaders())//没有响应头
                    // console.log(xhr.response)
                    arr = xhr.response.result
                    // for (let i = 0; i < xhr.response.length; i++) {
                    //     arr[i].push = xhr.response.result[i]
                    // }
                    console.log(arr)
                    // console.log(typeof (`
                    // <li>
                    //     <div class="song-image">
                    //         <img src="${arr[0].picUrl}" alt="">
                    //     </div>
                    //     <div class="song-name">${arr[0].name}</div>
                    //     <div class="song-author">
                    //         <i>by</i>
                    //         <span>阿卡琳</span>
                    //    </div>
                    // </li>
                    // `))

                    for (let i = 0; i < arr.length; i++) {
                        let Li = document.createElement('li')
                        Li.innerHTML = `
                            <div class="song-image">
                               <img src="${arr[i].picUrl}" alt="">
                            </div>
                            <div class="song-name">${arr[i].name}</div>
                        `
                        List.appendChild(Li)
                        //点击歌单切换界面
                        Li.addEventListener('click', function () {
                            const page = document.querySelector('.page-none')
                            page.classList.remove('page-none')
                            document.querySelector('.main-page').classList.add('page-none')
                            //获取歌单详情
                            myAjax({
                                method: 'GET',
                                url: 'http://47.120.38.121:3000/playlist/detail',
                                data: {
                                    id: arr[i].id
                                },
                                success: function (res) {
                                    // console.log(res)
                                    console.log(res.privileges)

                                    document.querySelector('.list-img img').src=res.playlist.coverImgUrl
                                    document.querySelector('.list-name h3').innerHTML=res.playlist.name
                                    document.querySelector('.author-img img').src=res.playlist.creator.avatarUrl
                                    document.querySelector('.author-name').innerHTML=res.playlist.creator.nickname
                                    const item= document.querySelectorAll('.item')
                                    for(let k=0;k<item.length;k++){
                                        item[k].innerHTML=res.playlist.tags[k]
                                    }
                                    document.getElementById('track-count').innerHTML=res.playlist.trackCount
                                    document.getElementById('play-count').innerHTML=res.playlist.playCount
                                    document.querySelector('.list-introduce').innerHTML=res.playlist.description

                                    //获取歌单内歌曲详情
                                    for(let j=0;j<res.privileges.length;j++){
                                        // console.log(j)
                                        myAjax({
                                        method: 'GET',
                                        url:'http://47.120.38.121:3000/song/detail',
                                        data:{
                                            ids:res.privileges[j].id
                                        },
                                        success:function(ress){
                                            console.log(ress)
                                            // recomList.push(ress)
                                            // console.log(recomList)
                                            let tr = document.createElement('tr')
                                            tr.classList.add('table-row')
                                            tr.innerHTML=`
                                            <td class="table-column1" id="song-name-${j}">
                                                    <div class="cell">${ress.songs[0].name}</div>
                                            </td>
                                            <td class="table-column2" id="song-author-${j}">
                                                <div class="cell">${ress.songs[0].ar[0].name}</div>
                                            </td>
                                            <td class="table-column3" id="song-album-${j}">
                                                <div class="cell">${ress.songs[0].al.name}</div>
                                            </td>
                                            <td class="table-column4" id="song-time-${j}">
                                                <div class="cell">05:30</div>
                                            </td>`
                                            document.getElementById('list-body').appendChild(tr)
                                        }
                                    })
                                    }
                                }
                            })
                            
                            
                        })
                    }
                }
            }
        }
        // console.log(recomList)
        // myAjax({
        //     method: 'GET',
        //     url: 'http://47.120.38.121:3000/playlist/track/all',
        //     data: {
        //         id: 2933222749
        //     },
        //     success: function (res) {
        //         console.log(res)
        //     }
        // })
        // myAjax({
        //     method: 'GET',
        //     url: 'http://47.120.38.121:3000/song/detail',
        //     data: {
        //         ids: 527354000
        //     },
        //     success: function (res) {
        //         console.log(res)
        //     }
        // })


    })();


    // 侧面及logo模块
    (function () {
        const logo = document.querySelector('.logo')
        const menuLocal = document.querySelector('.menu-local')
        const menuMain = document.querySelector('.menu-main')
        //侧面本地歌单界面
        menuLocal.addEventListener('click', function () {
            const page = document.querySelector('.page-none')
            page.classList.remove('page-none')
            document.querySelector('.main-page').classList.add('page-none')
            this.classList.add('menu-change')
            menuMain.classList.remove('menu-change')
        })
        //logo返回主页面
        logo.addEventListener('click', function () {
            const mainPage = document.querySelector('.main-page')
            mainPage.classList.remove('page-none')
            document.querySelector('.page').classList.add('page-none')
        })
        //侧面返回主页面
        menuMain.addEventListener('click', function () {
            const mainPage = document.querySelector('.main-page')
            mainPage.classList.remove('page-none')
            document.querySelector('.page').classList.add('page-none')
            this.classList.add('menu-change')
            menuLocal.classList.remove('menu-change')
        })
        //打开当前播放列表
        const listBtn = document.querySelector('.list-btn')
        listBtn.addEventListener('click', function () {
            document.querySelector('.drawer-none').classList.remove('drawer-none')
        })
        //关闭当前播放列表
        const drawerBtn = document.querySelector('.drawer-btn')
        drawerBtn.addEventListener('click', function () {
            document.querySelector('.drawer-wrapper').classList.add('drawer-none')
        })
        const drawerWrapper = document.querySelector('.drawer-wrapper')
        drawerWrapper.addEventListener('click', function (e) {
            if (e.clientX < 1036) {
                // console.log(e.clientX)
                document.querySelector('.drawer-wrapper').classList.add('drawer-none')
            }
        })
        // // 打开歌词界面
        // const listenInfor = document.querySelector('.listen-infor')
        // listenInfor.addEventListener('click', function () {
        //     const lyric = document.querySelector('.lyric')
        //     lyric.classList.remove('page-none')
        //     document.getElementById('my-container').classList.add('page-none')
        // })

    })();

    //音乐播放器模块
    (function () {
        //获取播放器
        const musicAudio = document.querySelector('audio')
        // console.log(musicAudio)

        //创建歌单对象数组
        let myList = [{
            id: 0,
            name: '可愛くなりたい ( 想变得可爱 )',
            author: 'HoneyWorks',
            // time: 04: 12,
            list: '可愛くなりたい',
            musicUrl: 'https://music.163.com/song/media/outer/url?id=1941266022.mp3',
        }, {
            id: 1,
            name: 'おかえり ( 欢迎回来 )',
            author: '小岩井ことり',
            // time: 04: 12,
            list: 'おかえり',
            musicUrl: 'https://music.163.com/song/media/outer/url?id=34367795.mp3',
        }]
        
        //获取歌单
        // const recomNowList=document.querySelectorAll('.list-table-body .table-row')
        // for(let i=0;i<recomNowList.length;i++){
        //     myList.push({
        //         id:i,
        //         name:document.getElementById('song-name-'+i),
        //         author:document.getElementById('song-author-'+i),
        //         list:document.getElementById('song-album-'+i),
        //     })

        // }
        //获取按钮
        const playAll = document.querySelector('.play-all')
        const playSong = document.querySelector('.play')
        const pauseSong = document.querySelector('.pause')
        const nextSong = document.querySelector('.right')
        const lastSong = document.querySelector('.left')
        const beforeDTR = document.querySelector('.drawer-body .table-row')
        const drawerBody = document.querySelector('.drawer-body tbody')
        const slideRunway = document.querySelector('.slider-runway')
        const sliderTag = document.querySelector('.slider-tag')


        let numSong = -1
        let songFlag = 0
        let sliderFlag = 0
        //录入歌单第一首歌

        playAll.addEventListener('click', function () {
            if (songFlag === 0) {
                // console.log(11)
                numSong = 0
                songFlag = 1
                // console.log(typeof (numSong))
                // console.log(myList[0].musicUrl)
                musicAudio.src = myList[numSong].musicUrl
                //转换为开始按钮
                playSong.style.display = 'block'
                pauseSong.style.display = 'none'
                // console.log(musicAudio.src)
                beforeDTR.style.display = 'none'
                for (let i = 0; i < myList.length; i++) {
                    // console.log(11)
                    let tr = document.createElement('tr')
                    tr.classList.add('table-row-change')
                    //更换左下角信息
                    document.querySelector('.listen-name').innerHTML=myList[numSong].name
                    document.querySelector('.listen-author').innerHTML=myList[numSong].author

                    tr.innerHTML = `
                <td class="drawer-column">
                    <div class="cell">${myList[i].name}</div>
                </td>
                <td class="drawer-column">
                    <div class="cell">${myList[i].author}</div>
                </td>
                <td class="drawer-column">
                    <div class="cell">00:00</div>
                </td>`
                    //给第一首歌添加高亮
                    drawerBody.appendChild(tr)
                    if (numSong === i) {
                        tr.classList.add('drawer-row-song-change')
                    }
                    //歌单内双击歌曲播放
                    tr.addEventListener('dblclick', function () {
                        // console.log(22)
                        numSong = i
                        musicAudio.pause()
                        musicAudio.src = myList[numSong].musicUrl
                        musicAudio.play()
                        //转换为停止按钮
                        playSong.style.display = 'none'
                        pauseSong.style.display = 'block'
                        //高亮跳转
                        document.querySelector('.drawer-row-song-change').classList.remove('drawer-row-song-change')
                        tr.classList.add('drawer-row-song-change')
                        //更换左下角信息
                        document.querySelector('.listen-name').innerHTML=myList[numSong].name
                        document.querySelector('.listen-author').innerHTML=myList[numSong].author
                    })
                }
            }
        })
        //开始
        playSong.addEventListener('click', function () {
            // console.log(11)
            musicAudio.play()
            //转换为停止按钮
            playSong.style.display = 'none'
            pauseSong.style.display = 'block'
            timeSpan()


        })
        //停止
        pauseSong.addEventListener('click', function () {
            musicAudio.pause()
            //转换为开始按钮
            playSong.style.display = 'block'
            pauseSong.style.display = 'none'
            // clearInterval('timeSpan')
        })
        //下一首
        nextSong.addEventListener('click', function () {
            // console.log(numSong)
            numSong = numSong + 1 >= myList.length ? 0 : numSong + 1
            // console.log(numSong)
            musicAudio.pause()
            musicAudio.src = myList[numSong].musicUrl
            musicAudio.play()
            //转换为停止按钮
            playSong.style.display = 'none'
            pauseSong.style.display = 'block'
            //更换左下角信息
            document.querySelector('.listen-name').innerHTML=myList[numSong].name
            document.querySelector('.listen-author').innerHTML=myList[numSong].author
        })
        //上一首
        lastSong.addEventListener('click', function () {
            // console.log(numSong)
            numSong = numSong - 1 < 0 ? myList.length - 1 : numSong - 1
            // console.log(numSong)
            musicAudio.pause()
            musicAudio.src = myList[numSong].musicUrl
            musicAudio.play()
            //转换为停止按钮
            playSong.style.display = 'none'
            pauseSong.style.display = 'block'
            //更换左下角信息
            document.querySelector('.listen-name').innerHTML=myList[numSong].name
            document.querySelector('.listen-author').innerHTML=myList[numSong].author
        })
        //播放结束时自动播放下一首
        musicAudio.addEventListener('ended', function () {
            numSong = numSong + 1 >= myList.length ? 0 : numSong + 1
            musicAudio.pause()
            musicAudio.src = myList[numSong].musicUrl
            musicAudio.play()
            //转换为停止按钮
            playSong.style.display = 'none'
            pauseSong.style.display = 'block'
            //更换左下角信息
            document.querySelector('.listen-name').innerHTML=myList[numSong].name
            document.querySelector('.listen-author').innerHTML=myList[numSong].author
        })
        //进度条控件  //能用但是不是很能用(或者说很没用)
        slideRunway.addEventListener('mousedown', function (e) {
            //拖拽状态设为1
            sliderFlag = 1
            // console.log(e.clientX)
            // let siteX = e.clientX
            // console.log(sliderTag.style.left)
            // if (sliderFlag === 0) {
            //     changeProcess(siteX)
            // }

        })
        slideRunway.addEventListener('mouseup', function () {
            sliderFlag = 0
        })
        slideRunway.addEventListener('mousemove', function (e) {
            if (sliderFlag === 1) {
                // console.log(e.clientX)
                changeProcess(e.clientX)
            }
        })


        function timeSpan() {
            setInterval(process, 1000)
        }

        function process() {
            let Process_Now = (musicAudio.currentTime * 100 / musicAudio.duration) + '%'
            document.querySelector('.slider-bar').style.width = Process_Now
            sliderTag.style.left = Process_Now
            let current_Time = timeFormat(musicAudio.currentTime)
            let time_All = timeFormat(musicAudio.duration)
            // document.getElementById("songtime").innerHTML = current_Time + " | " + time_All;
            document.getElementById('timing').innerHTML = current_Time
            document.getElementById('end-time').innerHTML = time_All
            // console.log(musicAudio.fastSeek)
            // console.log(musicAudio.currentTime)

        }

        function timeFormat(number) {
            var minute = parseInt(number / 60);
            var second = parseInt(number % 60);
            minute = minute >= 10 ? minute : "0" + minute;
            second = second >= 10 ? second : "0" + second;
            return minute + ":" + second;
        }

        function changeProcess(siteX) {
            var thisX = sliderTag.offsetLeft;
            // console.log(siteX - 560)
            thisX = siteX - 560

            // mouseX = siteX - thisX;
            // console.log(thisX)
            // *****将当前播放置为鼠标的位置
            var place = (thisX / 322.5) * musicAudio.duration;
            //注意：上一行的mousex-100的位置表示鼠标相对进度条起始位置的长度
            musicAudio.currentTime = place;//将播放时间设置为鼠标所在的进度条位置上代表的时间

        }




        //开始函数
        function st() {
            console.log(11)
            musicAudio.play()
            playSong.style.display = 'none'
            pauseSong.style.display = 'block'
        }

        //停止函数
        function st() {
            musicAudio.pause()
            playSong.style.display = 'block'
            pauseSong.style.display = 'none'
        }


    })();
}
