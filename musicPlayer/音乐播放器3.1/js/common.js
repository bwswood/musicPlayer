var filePath = "";											// �ļ�·��
var saveListFilePath = "\\tool\\musicList.sxx";				// �����б����ļ�·�����ļ���
var playStatusFilePath = "\\tool\\playStatus.sxx";			// �ϴβ���ʱ��ѡ�����ֲ���״̬�浵��������������˳��ȡ���
var arr = new Array();										// ��������
var fso = new ActiveXObject("Scripting.FileSystemObject");	// �ļ���������
var fl = "";												// �ļ��ж���
var reg = "MP3,WMA,mp3,wma,AVI,avi";						// �ļ�����
var file = "";												// �ļ�����
var spaceHtml = "";											// �����б��ı�
var nowMusic = 0;											// ��ǰ���Ÿ���
var preMusic = 0;											// ��һ�ײ��Ÿ���
var musicList = new Array();								// �б�����
var playType = "order";									    // ����״̬��Ĭ��˳��
var listIndex = 0;											// ���ŵ��б�Ĭ�ϵ�һ�б�

//alert(nsPlayer.\);
/* ���裬��û��ѡ��ȷ������ʱ���ѡ������л�
 * random-�������; order-˳�򲥷�; single-����ѭ��;
 */
function playNext()
{
	preMusic = nowMusic;
	if(playType == "random")
	{
		changeMusic();
	}
	else if(playType == "order")
	{
		nowMusic++;
		if(nowMusic == arr.length)
		{
			nowMusic = 0;
		}
		changeMusic(nowMusic);
	}
	else if(playType == "single")
	{
		changeMusic(preMusic);
	}
	else
	{
		changeMusic();
	}
}

//������һ��
function playPre()
{
	changeMusic(preMusic);
}

function changeMusic(num){
	if(arr.length != 0)
	{
		$("music"+nowMusic).style.color = "blue";
		$("music"+preMusic).style.color = "blue";
		if(num == undefined)
			num = Math.floor(Math.random()*arr.length); //���û��ָ����һ�����Զ����ѡ��
		nowMusic = num;
		filePath = new String(filePath);
		filePath = filePath.replace(/\\/g,'//');
		var url = unescape(filePath + "//" + arr[num]);
		wmp.open(url);
		setTimeout(playMusic,0);
		//document.getElementById("nowPlay").innerHTML = "���ڲ��ţ�" + url;
		document.title = arr[num];
		$("music"+nowMusic).style.color = "red";
	}
}

//��������
function playMusic()
{
	wmp.play();
}

//��ȡѡ��������ļ���·���������ļ������и���
function showMusic()
{
	var tmpPath = document.getElementById("filePath").value;
	if(tmpPath == "")
	{
		alert("��ѡ��·����");
		return;
	}
	filePath = tmpPath;
	spaceHtml = "";
	arr.splice(0,arr.length);
	file = fso.getFile(filePath);
	filePath = file.parentFolder;
	openPath(filePath);	
}

//��ȡ�ļ�·��
function getFilePath(urlPath)
{
	file = fso.getFile(urlPath);
	urlPath = file.parentFolder;
	return urlPath;
}

//���б�·��������cookie��
function writeCookie(str)
{
	document.cookie = "musicPath=" + str + ";";
}

//��ȡcookie�б�����ϴ��б�·��
function readCookie()
{
	filePath = getCookie("musicPath");
	openPath(filePath);
}

//��·�������и����б�
function openPath(url)
{
	$("musicSpace").innerHTML = " ";
	spaceHtml = " ";
	arr.splice(0,arr.length);
	try
	{
		filePath = url;
		fl = fso.getFolder(filePath);
		var fls = new Enumerator(fl.Files);
		while(!fls.atEnd()){
			var of = fls.item();
			if(checkMusicType(of.name))
				arr.push(of.name);
			fls.moveNext();
		}
	}
	catch (e)
	{
		alert("��ȡ·��ʧ�ܣ�");
		buttonShow("none");
	}
	
	for(var i=0;i<arr.length;i++)
	{
		spaceHtml += "<a id='music" + i + "' href='javascript:changeMusic(" + i + ")'>" + arr[i] + "</a>&nbsp;&nbsp;&nbsp;";
		if(i%5 == 4 && i > 0)
			spaceHtml += "<br><br>";
	}
	if(arr.length == 0)
	{
		spaceHtml = "��ǰ·��(<font color='red'>" + url + "</font>)�������֣�";
	}
	$("musicSpace").innerHTML = spaceHtml;
	if(arr.length != 0)
	{
		buttonShow("");
		//writeCookie(encodeURIComponent(filePath));
	}
	else
	{
		buttonShow("none");
	}
}

//��ť��ʼ��
function buttonShow(dis)
{
	$("changeMusic").style.display = dis;
	$("nextMusicBut").style.display = dis;
	$("preMusicBut").style.display = dis;
	$("playOrPause").style.display = dis;
}

//������һ�ף���û�и�������ʱ���ѡȡһ�׽��в���(δʹ��)
function nextMusic()
{
	if(nowMusic == "")
		nowMusic = Math.floor(Math.random()*arr.length);
	else
		nowMusic++;
	changeMusic(nowMusic);
}

//���ݴ����cookieName���ض�Ӧ��ֵ
function getCookie(cookieName)
{
	var cookieStr = decodeURIComponent(document.cookie);
	var start=0,end=0
	if(cookieStr.indexOf(cookieName) != -1)
	{
		start = cookieStr.indexOf(cookieName + "=") + cookieName.length;
		end = cookieStr.indexOf(";",start) > 0 ? cookieStr.indexOf(";",start) : cookieStr.length;
		return cookieStr.substring(start+1,end);
	}
	else
	{
		return "";
	}
}

//�ж��Ƿ��������ļ�
function checkMusicType(fileName)
{
	var musicTypes = reg.split(",");
	var flag = false;
	for(var n=0;n<musicTypes.length;n++)
	{
		if(fileName.indexOf(musicTypes[n]) != -1)
		{
			flag = true;
			break;
		}
	}
	return flag;
}

//ȡ�ô洢�ļ�����
function getReadFileObj(filePath)
{
	var pageLocation = getFormatUrl();
	pageLocation = getFilePath(pageLocation) + filePath;
	var fileObj = fso.OpenTextFile(pageLocation,1);
	return fileObj;
}

//ȡ�ö�д�ļ�����
function getWriteFileObj(filePath)
{
	var pageLocation = getFormatUrl();
	pageLocation = getFilePath(pageLocation) + filePath;
	var fileObj = fso.CreateTextFile(pageLocation,true);
	return fileObj;
}

//ȡ���ļ�����(δʹ��)
function getListFileObj()
{
	var pageLocation = getFormatUrl();
	pageLocation = getFilePath(pageLocation) + saveListFilePath;
	var fileObj = fso.getFile(pageLocation);
	return fileObj;
}

//�����б�
function saveList()
{
	var listName = $("listName").value;
	if(listName == "")
	{
		alert("����д�б����ƣ�");
		return;
	}

	if(filePath == "")
	{
		alert("��ǰ�б�Ϊ�գ�");
		return;
	}
	try
	{
		var readObj = getReadFileObj(saveListFilePath);
		var doc = "";
		if(!readObj.atEndOfStream)
		{
			doc = readObj.readAll();
		}
		
		filePath = new String(filePath);
		filePath = filePath.replace(/\\/g,'//');
		doc += listName + "|" + filePath;
		var writeObj = getWriteFileObj(saveListFilePath);
		writeObj.writeLine(doc);
		readObj.close();
		writeObj.close();
		musicList.push(new MusicList(listName,filePath));
		fullList();
		alert("�����б�ɹ���");
	}
	catch (e)
	{
		alert("�����б�ʧ�ܣ�ԭ��" + e);
		return;
	}
}

//�������ֲ���ʱ״̬ @building
function saveStatus(type)
{
	try
	{
		var writeObj = getWriteFileObj(playStatusFilePath);
		writeObj.writeLine(type);
		writeObj.close();
	}
	catch (e)
	{
		alert("����״̬�쳣��ԭ��" + e);
		return;
	}
}

//��ȡ�ϴβ���״̬ @building
function loadStatus()
{
	var musicTypes = document.all("musicType");
	var readObj = getReadFileObj(playStatusFilePath);
	while(!readObj.atEndOfStream)
	{
		var docLine = readObj.readLine();
		playType = docLine;
	}
	readObj.close();
	for(var i=0;i<musicTypes.length;i++)
	{
		if(playType == musicTypes[i].value)
		{
			musicTypes[i].checked = true;
		}
	}
}

//ȡ���б�
function loadList()
{
	var readObj = getReadFileObj(saveListFilePath);
	while(!readObj.atEndOfStream)
	{
		var docLine = readObj.readLine();
		var listObj = docLine.split("|");
		var musicListObj = new MusicList(listObj[0],listObj[1]);
		musicList.push(musicListObj);
	}
	fullList();
	readObj.close();
	changeMusic();
}

//����б�
function fullList()
{
	$("musicList").innerHTML = " ";
	for(var i=0;i<musicList.length;i++)
	{
		$("musicList").innerHTML += "<a href='javascript:openPath(\"" + musicList[i].url + "\")'>" + musicList[i].name + "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:delectList(" + i + ")'>ɾ��</a><br><br>";
	}
	if(musicList.length != 0)
	{
		openPath(musicList[0].url);
	}
}

//ɾ���б�
function delectList(index)
{
	var readObj = getReadFileObj(saveListFilePath);
	var doc = "";
	doc = encodeURIComponent(readObj.readAll());
	var musicLists = doc.split("%0D%0A");
	musicLists.splice(index,1);
	var docTmp = "";
	for(var l=0;l<musicLists.length;l++)
	{
		if(musicLists[l] != "")
		{
			docTmp += musicLists[l] + "%0D%0A";
		}
	}
	var writeObj = getWriteFileObj(saveListFilePath);
	writeObj.write(decodeURIComponent(docTmp));
	musicList.splice(index,1);
	fullList();
	readObj.close();
	writeObj.close();
}

//��ȡ�ļ�·��
function getFormatUrl()
{
	var pagehref = unescape(document.location); //��ȡ��ǰҳ��������ļ�URL
	var pageLocations = pagehref.split('///');
	var pageLocation = pageLocations[1]; //��ȡ��ǰҳ��·����
	return pageLocation;
}

//�����б������
function MusicList(name,url)
{
	this.name = name;
	this.url = url;
}

//�ı䲥�ŷ�ʽ
function changeType(type)
{
	playType = type;
	saveStatus(playType);
}

//����
function help(helpObj)
{
	$(helpObj).focus();
	$(helpObj).select();
}

//�������ƿ�ʼ
function setVolumeOnce(num)
{
	var tnum = wmp.Volume+num;
	if(tnum > 0)
	{
		tnum = 0;
	}
	if(tnum < -10000 )
	{
		tnum = -10000;
	}
	wmp.Volume = tnum;
	fillVolumeZoon();
}

function addVolume()
{
	interval = window.setInterval(addVolumeMethod,200);
}

function subVolume()
{
	interval = window.setInterval(subVolumeMethod,200);
}

function addVolumeMethod()
{
	setVolumeOnce(200);
}

function subVolumeMethod()
{
	setVolumeOnce(-200);
}

function stopSetVolume()
{
	try
	{
		window.clearInterval(interval);
	}
	catch (e)
	{
	}
}
//�������ƽ���

//������С��ʾ����
function volumeCount()
{
	return Math.round(((wmp.Volume+10000))/100);
}

//��ʾ������С
function fillVolumeZoon()
{
	var volume = volumeCount();
	$("volumeZoon").innerHTML = volume;
}

//����/��ͣ����
function playOrPause()
{
	if($("playOrPause").value == "��ͣ")
	{
		$("playOrPause").value = "����";
		wmp.pause();
	}
	else
	{
		$("playOrPause").value = "��ͣ"
		wmp.play();
	}
}

//��ӿ�ݼ�
function document.onkeydown()
{
	var keyCode = window.event.keyCode;
	switch(keyCode)
	{
		case 39: 
			playNext();
			break;
		case 37: 
			playPre();
			break;
		case 32: 
			playOrPause();
			break;
		case 38: 
			addVolumeMethod();
			break;
		case 40: 
			subVolumeMethod();
			break;
		default: return;
	}
}

//���ض���ȡ�ú���
function $(str)
{
	return document.getElementById(str);
}