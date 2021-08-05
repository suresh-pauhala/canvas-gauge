var lowAlarmflag;
var highAlarmflag;
if (!Array.prototype.forEach) {
Array.prototype.forEach = function(cb) {
    var i = 0, s = this.length;
    for (; i < s; i++) {
        cb && cb(this[i], i, this);
    }
}
}

document.fonts && document.fonts.forEach(function(font) {
font.loaded.then(function() {
    if (font.family.match(/Led/)) {
        document.gauges.forEach(function(gauge) {
            gauge.update();
            gauge.options.renderTo.style.visibility = 'visible';
        });
    }
});
});

var timers = [];


function animateGauges(value,index) {
document.gauges[index].value = value;
document.gauges[index].animation.update ;
}

// function changeGauge()
// {
// var e = document.getElementById("GaugesSelector");
// var value = e.options[e.selectedIndex].value;

// if(value=="pressure")
// {
//     document.getElementById("MesauringUnits").innerText="psi";
//     document.getElementById("SecondaryUnits").innerText="bar";
// }
// else if(value=="torque")
// {
//     document.getElementById("MesauringUnits").innerText="Nm";
//     document.getElementById("SecondaryUnits").innerText="Ft-Lbs";
// }
// else{
//     document.getElementById("MesauringUnits").innerText="Lbs";
//     document.getElementById("SecondaryUnits").innerText="Kg";
// }
// }



function saveOnClick(a)
{

var min=JSON.parse(document.getElementById("InputLowSensor1").value)
                        *JSON.parse(document.getElementById("InputLowSensor2").value);
var minimum = document.getElementById("InputLowSensor1").value
var minMultiplier=document.getElementById("InputLowSensor2").value
var max=JSON.parse(document.getElementById("InputHighSensor1").value)
                        *JSON.parse(document.getElementById("InputHighSensor2").value);
var maximun = document.getElementById("InputHighSensor1").value
var maxMultiplier=document.getElementById("InputHighSensor2").value

console.log(min);
console.log(max);

var lowAlarmPercent = document.getElementById("InputAlarmLow").value;
var highAlarmPercent = document.getElementById("InputAlarmHigh").value;

var lowAlarmChecked = document.getElementById("AlarmCheckLow");
var highAlarmChecked = document.getElementById("AlarmCheckHigh");           
lowAlarmChecked =   lowAlarmChecked.checked;
highAlarmChecked = highAlarmChecked.checked;
var primary = document.getElementById("MesauringUnits");
    var unit = primary.options[primary.selectedIndex].value;

    var secondary = document.getElementById("SecondaryUnits");
    var unit2 = secondary.options[secondary.selectedIndex].value;

var unit2=document.getElementById("SecondaryUnits").innerHTML;
// var e = document.getElementById("GaugeColor");
// var gaugeColor = e.options[e.selectedIndex].value;
var gauge;
var majorTicks=[];







majorTicks= calculateMajorTicks(min,max,10);

if(a==1){
    console.log("inside if")

    if(min > max){
        console.log("Please enter Sensor value low < high")
        return window.alert("Please enter Sensor value low < high")
    }
    if(lowAlarmPercent > highAlarmPercent ){
        return window.alert("Please enter Alarm value low < high")
    }
    storeSettings()
    localStorage.setItem("min",minimum)
    localStorage.setItem("minMultiplier",minMultiplier)
    localStorage.setItem("max",maximun)
    localStorage.setItem("maxMultiplier",maxMultiplier)
    localStorage.setItem("lowAlarmPercent",lowAlarmPercent)
    localStorage.setItem("highAlarmPercent",highAlarmPercent)
    localStorage.setItem("lowAlarmChecked",lowAlarmChecked)
    localStorage.setItem("highAlarmChecked",highAlarmChecked)

    gauge=getCurrentSelected();
}
else{
    if(min > max){
        console.log("Please enter Sensor value low < high")

        return window.alert("Please enter Sensor value low < high")
    }
    if(lowAlarmPercent > highAlarmPercent){
        return window.alert("Please enter Alarm value low < high")
    }
    document.getElementById("unit1").innerText=unit;
    document.getElementById("unit2").innerText=unit2;
    gauge=document.gauges[0];
}


    gauge.options.minValue=min;
    gauge.options.maxValue=max;
    gauge.options.units= unit
    //gauge.options.colorPlate= gaugeColor


    if(lowAlarmChecked && highAlarmChecked){
        var lowalarm = calculateLowAlarm(min,max,lowAlarmPercent);  
        var highalarm = calculateHighAlarm(min,max,highAlarmPercent);  
        highAlarmflag=0
        lowAlarmflag=1;
        highAlarmflag = 1
        gauge.options.highlights[0].from = min
        gauge.options.highlights[0].to = lowalarm
        gauge.options.highlights[1].from = highalarm        
        gauge.options.highlights[1].to = max
    }
    

    else if(highAlarmChecked){
        var highalarm = calculateHighAlarm(min,max,highAlarmPercent);  
        lowAlarmflag=0;
        highAlarmflag = 1
        
            lowAlarmflag = 1;
            gauge.options.highlights[0].from = ""
            gauge.options.highlights[0].to =""
            gauge.options.highlights[1].from = highalarm        
            gauge.options.highlights[1].to = max
        }
      else  if(lowAlarmChecked){
            var lowalarm = calculateLowAlarm(min,max,lowAlarmPercent);  
            gauge.options.highlights[0].from = min          
            gauge.options.highlights[0].to = lowalarm
            gauge.options.highlights[1].from = ""        
            gauge.options.highlights[1].to = max =""
        }
        
    
    else if(!lowAlarmChecked && !highAlarmChecked){
        gauge.options.highlights[1].from = ""       
        gauge.options.highlights[1].to = ""
        gauge.options.highlights[0].from = ""        
        gauge.options.highlights[0].to = max =""
    }

    gauge.options.majorTicks=majorTicks;

    gauge.update();
    setAlarm(gauge);                           

}
function calculateMajorTicks(min,max,n){
if((min <0 && max<0) || (min >0 && max>0))
    var div=Math.abs(max-min)/n;
else
    var div=(max+Math.abs(min))/n; 
var res=min;
var arr=[];
for(var i=0;i<n;i++)
{
    arr[i]=Math.ceil(res);       
    res=res+div;
}
arr[n]=max;

return arr;
}

function calculateLowAlarm(min,max,lowAlarmPercent){
minNew= min
min=Math.abs(min);
total = min + max;
minAlarmPercentValue = (total*lowAlarmPercent)/100
minAlarmFinalValue = minNew + minAlarmPercentValue
return minAlarmFinalValue

}
function calculateHighAlarm(min,max,highAlarmPercent){
minNew= min
min=Math.abs(min);
total = min + max;
maxAlarmPercentValue = (total*highAlarmPercent)/100
maxAlarmFinalValue = (minNew + maxAlarmPercentValue)
return maxAlarmFinalValue

}



function resize() {
var size = parseFloat(document.getElementById('gauge-size').value) || 500;

document.gauges.forEach(function (gauge) {
    gauge.update({ width: size, height: size });
});
}

function updateUnits() {
document.gauges.forEach(function (gauge) {
    gauge.update({ units: 'Miles' });
});
}

function setText() {
var text = document.getElementById('gauge-text').value;

document.gauges.forEach(function (gauge) {
    gauge.update({ valueText: text });
});
}
function storeSettings(){

    var storeUnit1 = []
    var storeUnit2 = []
    var storeUnit3 = []
    var gaugecolors = []
    
    var mainUnit = document.getElementById("GaugesSelector");
    var primaryUnit = document.getElementById("MesauringUnits");
    var secondaryUnit = document.getElementById("SecondaryUnits");
    var gaugeColor =document.getElementById("GaugeColor"); 
    
    var mainlength = mainUnit.options.length
    var primaryLength = primaryUnit.options.length
    var secondaryLength = secondaryUnit.options.length
    var gaugeColorLength = gaugeColor.options.length

    for(var m=0; m<mainlength;m++){
    storeUnit1.push(mainUnit.options[m].value)
}
for(var n=0; n<primaryLength;n++){
    storeUnit2.push(primaryUnit.options[n].value)
}
for(var index=0; index<secondaryLength;index++){
    storeUnit3.push(secondaryUnit.options[index].value)
}

for(var index=0; index<gaugeColorLength;index++){
    gaugecolors.push(gaugeColor.options[index].value)
}


localStorage.setItem("mainUnit",JSON.stringify(storeUnit1))
localStorage.setItem("primaryUnit",JSON.stringify(storeUnit2))
localStorage.setItem("secondaryUnit",JSON.stringify(storeUnit3))
localStorage.setItem("gaugeColors",JSON.stringify(gaugecolors))


}



function getCurrentSelected()
{
    var e = document.getElementById("GaugesSelector");
    var value = e.options[e.selectedIndex].value;

    if(value=="pressure")
    {
        return document.gauges[1];
    }
    else if(value=="torque")
    {
        return document.gauges[2];
    }    
    else{
        return document.gauges[0];
    }
}



setAlarm = function(gauge) {

gauge.on('beforeNeedle', function () {


    var context = this.canvas.context;
    var pixel = context.max / 100;
    var centerX = 32 * pixel;
    var centerY = 0;
    var radius = 8 * pixel;

    context.save();

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

    var gradient = context.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius);

    if(this.options.value <= this.options.highlights[0].to && this.options.highlights[0].to)
    {
        centerX = -32 * pixel;
        centerY = 0;
        radius = 5 * pixel;
        context.save();

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

        gradient = context.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius);

        gradient.addColorStop(0, this.options.value <= this.options.highlights[0].to ? '#0000ff' : '#008000');    
    }
    if(this.options.highlights[1].from <= this.options.value && this.options.highlights[1].from)
    {
        centerX = 32 * pixel;
        centerY = 0;
        radius = 5 * pixel;
        context.save();

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

        gradient = context.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius);

        gradient.addColorStop(0, this.options.highlights[1].from <= this.options.value ? '#e60000' : '#008000');
    }
    context.fillStyle = gradient;
    context.fill();
    context.closePath();

    context.restore();
});

gauge.draw();
}