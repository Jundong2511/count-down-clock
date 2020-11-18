import React from "react";
import ReactDOM, { render } from "react-dom";
import "./index.css";

class Body extends React.Component {

    render() {
        return (
            <div className="clock">

                <div className="h1">
                    <h1>25 + 5 Clock</h1>
                </div>
                <div className="break-box">
                    <div id="break-label">Break Length</div>
                    <button id="break-decrement" onClick={this.props.breakDecrementClick}>break-decrement</button>
                    <div id="break-length">{this.props.break}</div>
                    <button id="break-increment" onClick={this.props.breakIncrementClick}>break-increment</button>
                </div>
                <div className="session-box">
                    <div id="session-label">Session Length</div>
                    <button id="session-decrement" onClick={this.props.sessionDecrementClick}>session-decrement</button>
                    <div id="session-length">{this.props.session}</div>
                    <button id="session-increment" onClick={this.props.sessionIncrementClick}>session-increment</button>
                </div>
                <div className="countdown-box">
                    <div id="timer-label">{this.props.sessionOrBreak}</div>
                    <div id="time-left">{this.props.timeLeftMinutes}:{this.props.timeLeftSecond}</div>
                    <div className="countdown-buttons">
                        <button id="start_stop" onClick={this.props.startStopClick}>start_stop</button>
                        <button id="reset" onClick={this.props.resetClick}>reset</button>
                    </div>
                </div>
            </div>
        )
    }
}
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onSession: true,
            session: 25,
            break: 5,
            play: true,
            timeLeftMinutes: "25",
            timeLeftSecond: "00",
            nextBreak: true,
            sessionOrBreak: "Session",
        }
        this.handleBreakDecrementClick = this.handleBreakDecrementClick.bind(this)
        this.handleBreakIncrementClick = this.handleBreakIncrementClick.bind(this)
        this.handleSessionDecrementClick = this.handleSessionDecrementClick.bind(this)
        this.handleSessionIncrementClick = this.handleSessionIncrementClick.bind(this)
        this.handleStartStopClick = this.handleStartStopClick.bind(this)
        this.handleResetClick = this.handleResetClick.bind(this)
    }
    handleBreakDecrementClick() {
        if (this.state.break > 1 && this.state.onSession === true)
            this.setState({
                break: this.state.break - 1,
            })
    }
    handleBreakIncrementClick() {
        if (60 > this.state.break) {
            if (this.state.onSession === true)
                this.setState({
                    break: this.state.break + 1,
                })
        }
    }
    handleSessionIncrementClick() {
        if (60 > this.state.session) {
            if (this.state.onSession === true)
                this.setState({
                    session: this.state.session + 1,
                })
        }
    }
    handleSessionDecrementClick() {
        if (this.state.session > 1 && this.state.onSession === true)
            this.setState({
                session: this.state.session - 1,
            })
    }
    // every second timeLeftSecond -1, when it reachs 00, become 59, timeLeftSecond -1, if reach 00:00, call audio play, set break to timeLeft, call this function again
    handleStartStopClick() {
        // if play is true, click is play, otherwise is pause // when click, play is true
        console.log("play clicked")
        if (this.state.onSession === true) {
            this.setState({
                timeLeftMinutes: ("0" + (this.state.session).toString()).slice(-2),
                onSession: false,
            })
        }
        if (this.state.play) {
            this.setState({
                play: !this.state.play
            })

            if (this.state.timeLeftSecond >= 0 || this.state.timeLeftMinutes >= 0) {
                console.log("timer: now left time is " + this.state.timeLeftMinutes + ":" + this.state.timeLeftSecond)
                this.timerRunning = setInterval(() => {
                    if (this.state.timeLeftSecond > 0) {

                        this.setState({
                            timeLeftSecond: ("0" + (this.state.timeLeftSecond - 1).toString()).slice(-2)
                        })
                        console.log("first running" + this.state.timeLeftMinutes + ":" + this.state.timeLeftSecond)
                    }
                    if (this.state.timeLeftSecond == 0 && this.state.timeLeftMinutes > 0) {
                        console.log("second running" + this.state.timeLeftMinutes + ":" + this.state.timeLeftSecond)
                        this.setState({
                            timeLeftSecond: 59,
                            timeLeftMinutes: ("0" + (this.state.timeLeftMinutes - 1).toString()).slice(-2)
                        })
                    }
                    if (this.state.timeLeftSecond == 0 && this.state.timeLeftMinutes == 0) {
                        if (this.state.nextBreak) {
                            console.log("audio running" + this.state.timeLeftMinutes + ":" + this.state.timeLeftSecond)
                            this.audio.play();
                            this.setState({
                                timeLeftMinutes: ("0" + (this.state.break).toString()).slice(-2),
                                timeLeftSecond: "00",
                                nextBreak: !this.state.nextBreak,
                                sessionOrBreak: "Session"
                            })
                        } else {
                            this.setState({
                                timeLeftMinutes: ("0" + (this.state.session).toString()).slice(-2),
                                timeLeftSecond: "00",
                                nextBreak: !this.state.nextBreak,
                                sessionOrBreak: "Break"
                            })
                        }
                    }
                }, 1000);
            }
        }
        // when click, play is false
        else if (this.state.play === false) {

            clearInterval(this.timerRunning)
            this.setState({
                play: !this.state.play
            })
            console.log("pause clicked")
        }
    }
    handleResetClick() {
        clearInterval(this.timerRunning)
        this.setState({
            timeLeftMinutes: 25,
            timeLeftSecond: "00",
            session: 25,
            break: 5,
            play: true,
            onSession: true,
            nextBreak: true
        })

    }
    render() {
        return (
            <div>
                <Body
                    break={this.state.break}
                    session={this.state.session}
                    timeLeftMinutes={this.state.timeLeftMinutes}
                    timeLeftSecond={this.state.timeLeftSecond}
                    breakDecrementClick={this.handleBreakDecrementClick}
                    breakIncrementClick={() => this.handleBreakIncrementClick()}
                    sessionDecrementClick={() => this.handleSessionDecrementClick()}
                    sessionIncrementClick={() => this.handleSessionIncrementClick()}
                    startStopClick={() => this.handleStartStopClick()}
                    resetClick={() => this.handleResetClick()}
                    sessionOrBreak={this.state.sessionOrBreak}
                />
                <audio id="beep"
                    src="https://dm0qx8t0i9gc9.cloudfront.net/previews/audio/BsTwCwBHBjzwub4i4/elegant-ding-interface-sounds_M1tbhH4O_NWM.mp3" ref={el => this.audio = el}></audio>
            </div>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById("root"));
