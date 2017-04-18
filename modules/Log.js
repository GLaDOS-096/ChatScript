// Chatroom app module of logs
// Module powered by JavaScript

const fs = require('fs')
const message = require('./Message.js')

var Logger = function Logger(logger) {
    var self = this
    self.tickrate = logger.tickrate || 2000
    self.logPath = (function (path) {
        return function logPath() {
            return path || process.cwd() + "/log"
        }
    })(logger.path)
    self.missionStack = []
    self.registerTickMission = function registerTickMission(mission) {
        if (mission.name) {
            self.missionStack.forEach(function (__mission__) {
                if (__mission__.name == mission.name) {
                    return {
                        "src": "log",
                        "msg": "Mission name '" + mission.name + "' occupied."
                    }
                }
            })
            self.missionStack.push(mission)
            return {
                "src": "log",
                "msg": "Mission " + mission.name + " registered."
            }
        } else {
            return {
                "src": "log",
                "msg": "Mission name undefined."
            }
        }
    }
    self.deleteMission = function deleteMission(name) {
        self.missionStack.forEach(function (mission, index) {
            if (mission.name == name) {
                self.missionStack.splice(index, 1)
                return {
                    "src": "log",
                    "msg": "Mission " + name + " deleted."
                }
            }
        })
    }
    self.startTick = function startTick() {
        return setInterval(function () {
            self.missionStack.forEach(function (mission) {
                mission()
            })
        }, self.tickrate)
    }
    self.stopTick = function stopTick(tick) {
        clearInterval(tick)
    }
    self.log = function log(msg){
        var __date__ = new Date()
        var logName = (function(){
            var year = __date__.getFullYear().toString()
            var month = __date__.getMonth().toString()
            if (month.length==){
                month = "0" + month
            }
            var day = __date__.getDate().toString()
            return year+month+day+".log"
        })()
        var log = __date__.toLocaleString() + message.stringfy(msg)
        fs.appendFile(path+"/"+logName,log,function(err){
            if (err){
                throw err
            }
        })
    }
}
