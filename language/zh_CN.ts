/* eslint quotes: 0 */
export const translation = {
    // backup
    "invalidBackupID": "您必须输入有效的备份文件ID！",
    "backupInformation": "备份信息",
    "backupID": "备份文件ID",
    "serverID": "伺服器ID",
    "backupSize": "文件大小",
    "backupCreatedAt": "创建于",
    "noBackupFound": "找不到`%VAR%`这个ID！",
    "backupNotAdmin": "你必须是伺服器管理员才能请求备份！",
    "startBackup": "开始备份...\n频道最大备份讯息量: %VAR%\n图片格式: base64",
    "doneBackupDM": "✅ | 备份已创建! 要加载备份, 请在目标伺服器中输入此指令: `%VAR%load %VAR%`!",
    "doneBackupGuild": "备份已创建。备份ID已发送至私讯！",
    "warningBackup": "加载备份后, 所有的原本的频道，身分组等将无法复原！ 输入 `-confirm` 确认!",
    "timesUpBackup": "时间到! 已取消备份加载!",
    "startLoadingBackup": "✅ | 开始加载备份!",
    "backupError": "🆘 | 很抱歉，出了点问题... 请检查我有没有管理员权限!",
    "doneLoadingBackup": "✅ | 群组备份完成！",
    "backupOutOfRange": "频道最大备份讯息数不能小于0或大于1000！",

    // 8ball
    "noQuestion": "你要问问题啦干",
    "reply1": "这是必然",
    "reply2": "肯定是的",
    "reply3": "不用怀疑",
    "reply4": "毫无疑问",
    "reply5": "你能相信它",
    "reply6": "如我所见，是的",
    "reply7": "很有可能",
    "reply8": "看起来很好",
    "reply9": "是的",
    "reply10": "种种迹象指出「是的」",
    "reply11": "回覆拢统，再试试",
    "reply12": "待会再问",
    "reply13": "最好现在不告诉你",
    "reply14": "现在无法预测",
    "reply15": "专心再问一遍",
    "reply16": "想的美",
    "reply17": "我的回覆是「不」",
    "reply18": "我的来源说「不」",
    "reply19": "看起来不太好",
    "reply20": "很可疑",
    "reply": "神奇八号球 🎱 回答:",

    // connect4
    "board": "现在轮到 %VAR%!\n%VAR%",
    "invalidMove": "你不能往那边放棋子！",
    "win": "%VAR% 赢了!",

    // loli
    "noToken": "沒有pixiv refreshToken不能使用这个指令！",

    // pixiv
    // - noToken in loli
    "noIllust": "这个画作不存在！",
    "noUser": "这个用户不存在！",
    "noResult": "🆘 | 我找不到任何搜寻结果！",
    "unknownSubcommand": "无效的子指令！",

    // updateIllust
    // - noToken in loli

    // yt-together
    "notInVC": "加入语音频道后才能使用此指令！",

    // anime
    "similarity": "相似度: %VAR%%",
    "sourceURL": "**来源链接**",
    "nativeTitle": "日语标题",
    "romajiTitle": "罗马音标题",
    "englishTitle": "英语标题",
    "episode": "集数",
    "NSFW": "NSFW",
    "invalidURL": "请输入正确的网址!",
    "noImage": "你要先上传一张图片才能使用这个指令!",

    // avatar
    "yourAvatar": "__你的头像__",
    "userAvatar": "__%VAR%的头像__",
    "memberAvatar": "__%VAR%的头像__",
    "noMember": "找不到匹配 %VAR% 的用户!",

    // covid
    "covidTitle": "**%VAR% COVID-19 数据**",
    "totalCases": "总病例",
    "confirmedToday": "今日确诊",
    "totalDeaths": "总死亡案例",
    "deathsToday": "今日死亡",
    "totalRecovered": "总康复病例",
    "recoveredToday": "今日康复",
    "activeCases": "活跃病例",
    "criticalCases": "严重病例",
    "population": "人口数",
    "covidFooter": "请求者: %VAR%\n更新于: %VAR%",
    "invalidArgument": "请输入正确的参数!",
    "covidExample": "例如: `c!covid global` 或 `c!covid countries`",

    // google

    // help
    "helpTitle": "指令列表",
    "helpPrompt": "这是我所有的指令:",
    "helpPrompt2": "\n你可以发送 `%VAR%help [command name]` 来查询指令详情!",
    "helpSend": "我已经把我的指令列表私讯给你了！",
    "invalidCmd": "该指令不存在!",
    "cmdName": "**名字:**",
    "cmdAliases": "**别名:**",
    "cmdDescription": "**描述:**",
    "cmdUsage": "**用法:**",
    "cmdCoolDown": "**冷却:**",

    // invite
    "invite": "邀請我！",

    // run
    "invalidUsage": "无效用法！ 无效的语言/代码。",
    "wait": "请稍等...",
    "usage": "用法: c!run <语言> [代码](有无代码块皆可)",
    "notSupported": "不支持该语言！",
    "outputTooLong": "输出过长 (超过2000个字符/40行)，所以我把它上传到了这里： %VAR%",
    "postError": "输出太长了， 但是我无法将输出上传到网站上。",
    "noOutput": "没有输出！",

    // sauce
    // similarity in anime
    // sourceURL in anime
    "searchingSauce": "正在搜索图片...",
    "additionalInfo": "额外信息",
    "noAuthor": "找不到作者信息！",
    "sauceAuthor": "名字: %VAR%\n链接: %VAR%",
    "sauceTitle":"标题",
    "author":"作者",

    // server
    "serverInfo": "伺服器资料",
    "serverName": "伺服器名字",
    "serverOwner": "伺服器拥有者",
    "memberCount": "伺服器人数",
    "serverRegion": "伺服器区域",
    "highestRole": "最高身份组",
    "serverCreatedAt": "伺服器创造时间",
    "channelCount": "伺服器频道数",

    // user-info
    "customStatus": "__自定义活动__\n<:%VAR%:%VAR%> %VAR%\n",
    "gameStatus": "__%VAR%__\n%VAR%\n%VAR%",
    "notPlaying": "用户没在玩游戏",
    "uiTitle": "用户资料",
    "tag": "Tag",
    "nickname": "昵称",
    "id": "ID",
    "avatarURL": "头像",
    "avatarValue": "[点我](%VAR%)",
    "createdAt": "账户创造时间",
    "joinedAt": "加入伺服器时间",
    "activity": "活动",
    "none": "无",
    "status": "状态",
    "device": "设备",
    "roles": "身分组(%VAR%)",

    // ban
    "noMentionBan": "你要提及一个人才能对他停权！",
    "cantBanSelf": "你不能对你自己停权啦",
    "cannotBan": "不能对这个人停权",
    "banSuccess": "成功对 %VAR%停权！",

    // kick
    "noMentionKick": "你要提及一个人才能踢出他！",
    "cantKickSelf": "你不能踢出你自己啦",
    "cannotKick": "不能踢出这个人！",
    "kickSuccess": "成功踢出 %VAR%！",

    // prune
    "invalidNum": "这看起来不像是有效的数字！",
    "notInRange": "请输入1到99之间的数字！",
    "pruneError": "在尝试删除讯息时发生了错误！",

    // clear
    "cleared": "播放清单已清除！",

    // loop
    "loopOn": "循环模式开启！",
    "loopOff": "循环模式关闭！",

    // loop-queue
    "loopQueueOn": "清单循环模式开启！",
    "loopQueueOff": "清单循环模式关闭！",

    // lyric
    "searching": "🔍 | 正在搜寻 %VAR%...",
    "noLyricsFound": "找不到 `%VAR%` 的歌词！",
    "lyricTitle": "`%VAR%` 的歌词",
    "noKeyword": "没有提供关键词！",

    // now-playing
    "npTitle": "**正在播放 ♪**",
    "requester": "请求者:",
    "musicFooter": "音乐系统",

    // pause
    "pause": "已暂停！",

    // play
    // notInVC in yt-together
    "cantJoinVC": "我需要加入频道和说话的权限!",
    "importAlbum1": "✅ | 专辑: **%VAR%** 导入中",
    "importAlbum2": "✅ | 专辑: **%VAR%** 导入中 **%VAR%**",
    "importAlbumDone": "✅ | 专辑: **%VAR%** 已加入到播放清单!",
    "importPlaylist1": "✅ | 播放列表: **%VAR%** 导入中",
    "importPlaylist2": "✅ | 播放列表: **%VAR%** 导入中 **%VAR%**",
    "importPlaylistDone": "✅ | 播放列表: **%VAR%** 已加入到播放清单!",
    // noResult in pixiv
    "noArgs": "不要留白拉干",
    // searching in lyric
    "choose": "请选择歌曲",
    "timeout": "时间到！",

    // queue
    "queueTitle": "播放清单",
    "queueBody": "**正在播放**\n[%VAR%](%VAR%)\n\n**在清单中**\n%VAR%\n%VAR% 首歌",

    // related
    "relatedSearch": "🔍 | 正在搜寻相关歌曲...",
    // noResult in pixiv

    // remove
    "removed": "已移除 %VAR%！",
    "invalidInt": "请输入有效的数字！",

    // resume
    "playing": "我已经在播放了！",
    "resume": "继续播放！",

    // skip
    "skipped": "已跳过歌曲",

    // stop
    "stopped": "已停止播放",

    // n
    "notNSFW": "这里不是NSFW频道!",
    "noNum": "请输入六位数本本号!",

    // nhentai
    "invalidBookID": "本本号不存在！",

    // set
    "languageNotSupported": "不支持该语言！",
    "changeSuccess": "成功更换语言至`%VAR%`！",
    "argsNotChannel": "没有提供频道！",
    "argsNotRole": "没有提供身份组！",
    "argsNotNumber": "没有提供数字！",
    "noRole": "没有提供身份组！",
    "logChannelChanged": "记录频道调整至 %VAR%！",
    "starboardChanged": "名句精华调整至 %VAR%！",
    "levelRewardAdded": "成功添加身份组奖励: %VAR% => %VAR%！",
    "levelRewardRemoved": "成功移除身份组奖励: %VAR% => %VAR%！",

    // cemoji
    "noEmoji": "请告诉我要复制哪个表情！",
    "addSuccess": "表情 `%VAR%` %VAR% 已被加入到伺服器中！",

    // edit-snipe
    "exceed10": "不能超过10！",
    "invalidSnipe": "无效狙击！",
    "noSnipe": "没有能狙击的讯息！",

    // snipe
    // exceed10 in edit snipe
    // invalidSnipe in edit snipe
    // noSnipe in edit snipe

    // ping
    "pinging": "Pinging...",
    "heartbeat": "Websocket 心跳：",
    "latency": "往返延迟：",
};