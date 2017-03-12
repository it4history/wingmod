import React, {Component} from 'react';

class KillRow extends Component {
    constructor(props, context) {
        super(props, context);

        this.enemyIconScale = 10;

        this.countTime = 500; //miliseconds

        this.componentStyle = {
            row: {
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'                
            },

            text: {
                fontFamily: 'Oswald-Regular',
                fontSize: '2vw',
                color: 'white',
                width: '40%',
                textAlign: 'right'
            },

            number: {
                fontFamily: 'Oswald-Regular',
                fontSize: '2vw',
                color: 'white',
                width: '25%'
            },

            enemyIcon: {
                background: 'url("gfx/enemiesIcons.png") -###vh 0px',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                width: this.enemyIconScale + 'vh',
                height: this.enemyIconScale + 'vh'
            },

            iconSection: {
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '25%'
            },

            textSection: {
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '40%'
            }
        };

        this.state = {
            visible: true,
            currentKillCount: 0,
            currentPointWorth: 0,
            value: 0
        };

        setTimeout(() => {
            PubSub.publish('summaryBegin');
        }, 100);        

        let intervalId = setInterval(() => {
            if (this.state.currentKillCount < this.props.killCount) {
                this.setState({
                    currentKillCount: this.state.currentKillCount += 1,
                    currentPointWorth: this.state.currentPointWorth += this.props.pointWorth
                });                
                PubSub.publish('addFinalPoints', this.props.pointWorth);
                this.render();
            } else {
                clearInterval(intervalId);
                PubSub.publish('summaryEnd');
            }            
        }, (this.countTime * (1 + 0.25 * this.props.killCount)) / this.props.killCount);
    }

    onChange(value) {
        this.setState({value: value});
    }

    render() {
        if (!this.state.visible) return null;

        let offset = (this.props.header ? -1 : this.props.enemyIndex) * this.enemyIconScale;
        let enemyIconStyle = this.componentStyle.enemyIcon;
        enemyIconStyle.background = enemyIconStyle.background.replace(/###/g, offset);

        return <div style={this.componentStyle.row}>
            <div style={this.componentStyle.iconSection}>
                <div style={enemyIconStyle}></div>
            </div>
            <div style={this.componentStyle.textSection}>
                <div style={this.componentStyle.text}>{this.props.enemyName}</div>
                <div style={this.componentStyle.number}>{'x' + this.state.currentKillCount}</div>
                <div style={this.componentStyle.number}>{this.state.currentPointWorth + (this.props.header ? '' :  ' $')}</div>
            </div>
        </div>;
    }
}

module.exports = KillRow;
