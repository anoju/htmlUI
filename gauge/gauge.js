class GaugeChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height - 80;
        this.radius = 180;
        this.currentLevel = 1;
        this.targetNeedleAngle = 0;
        this.currentNeedleAngle = 0;
        this.animationSpeed = 0.1;
        
        this.levels = [
            { name: '관심', color: '#4CAF50', startAngle: -180, endAngle: -135, textAngle: -157.5 },
            { name: '주의', color: '#FFC107', startAngle: -135, endAngle: -90, textAngle: -112.5 },
            { name: '경계', color: '#FF9800', startAngle: -90, endAngle: -45, textAngle: -67.5 },
            { name: '심각', color: '#F44336', startAngle: -45, endAngle: 0, textAngle: -22.5 }
        ];
        
        this.init();
    }
    
    init() {
        this.canvas.addEventListener('click', () => {
            this.setLevel((this.currentLevel % 4) + 1);
        });
        
        this.setLevel(1);
        this.animate();
    }
    
    setLevel(level) {
        this.currentLevel = level;
        this.targetNeedleAngle = this.levels[level - 1].textAngle;
    }
    
    drawSegment(startAngle, endAngle, color, isActive = false) {
        this.ctx.save();
        
        if (isActive) {
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = color;
            this.ctx.fillStyle = color;
        } else {
            this.ctx.fillStyle = '#e8e8e8';
        }
        
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 
                    this.toRadians(startAngle), this.toRadians(endAngle));
        this.ctx.arc(this.centerX, this.centerY, this.radius - 50, 
                    this.toRadians(endAngle), this.toRadians(startAngle), true);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawText(text, angle, color) {
        this.ctx.save();
        
        const textRadius = this.radius - 25;
        const radian = this.toRadians(angle);
        const x = this.centerX + Math.cos(radian) * textRadius;
        const y = this.centerY + Math.sin(radian) * textRadius;
        
        this.ctx.fillStyle = color;
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.ctx.translate(x, y);
        this.ctx.rotate(radian + Math.PI/2);
        this.ctx.fillText(text, 0, 0);
        
        this.ctx.restore();
    }
    
    drawNeedle() {
        this.ctx.save();
        
        const needleLength = this.radius - 60;
        const radian = this.toRadians(this.currentNeedleAngle);
        
        this.ctx.translate(this.centerX, this.centerY);
        
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        
        const endX = Math.cos(radian) * needleLength;
        const endY = Math.sin(radian) * needleLength;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawScale() {
        this.ctx.save();
        
        for (let i = 0; i <= 8; i++) {
            const angle = -180 + (i * 22.5);
            const radian = this.toRadians(angle);
            const outerRadius = this.radius - 40;
            const innerRadius = outerRadius - (i % 2 === 0 ? 15 : 8);
            
            const x1 = this.centerX + Math.cos(radian) * outerRadius;
            const y1 = this.centerY + Math.sin(radian) * outerRadius;
            const x2 = this.centerX + Math.cos(radian) * innerRadius;
            const y2 = this.centerY + Math.sin(radian) * innerRadius;
            
            this.ctx.strokeStyle = '#ccc';
            this.ctx.lineWidth = i % 2 === 0 ? 2 : 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawScale();
        
        for (let i = 0; i < 4; i++) {
            // const isActive = i < this.currentLevel;
            const isActive = i === this.currentLevel - 1;
            this.drawSegment(
                this.levels[i].startAngle, 
                this.levels[i].endAngle, 
                this.levels[i].color, 
                isActive
            );
        }
        
        for (let i = 0; i < 4; i++) {
            // const textColor = i < this.currentLevel ? 'white' : '#999';
            const textColor = i === this.currentLevel - 1 ? 'white' : '#999';
            this.drawText(this.levels[i].name, this.levels[i].textAngle, textColor);
        }
        
        this.drawNeedle();
    }
    
    animate() {
        const angleDiff = this.targetNeedleAngle - this.currentNeedleAngle;
        
        if (Math.abs(angleDiff) > 0.5) {
            this.currentNeedleAngle += angleDiff * this.animationSpeed;
        } else {
            this.currentNeedleAngle = this.targetNeedleAngle;
        }
        
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}

const gauge = new GaugeChart('gaugeCanvas');