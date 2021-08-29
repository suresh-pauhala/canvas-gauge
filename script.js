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



function saveOnClick()
{

var min=JSON.parse(document.getElementById("InputLowSensor1").value)
                        *JSON.parse(document.getElementById("InputLowSensor2").value);
var minimum = document.getElementById("InputLowSensor1").value
var minMultiplier=document.getElementById("InputLowSensor2").value
var max=JSON.parse(document.getElementById("InputHighSensor1").value)
                        *JSON.parse(document.getElementById("InputHighSensor2").value);
var maximun = document.getElementById("InputHighSensor1").value
var maxMultiplier=document.getElementById("InputHighSensor2").value

// console.log(min);
// console.log(max);

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
var e = document.getElementById("GaugeColor");
var gaugeColor = e.options[e.selectedIndex].value;
var gauge;
var majorTicks=[];

majorTicks= calculateMajorTicks(min,max,10);


    

    if(min > max){
        console.log("Please enter Sensor value low < high")
        return window.alert("Please enter Sensor value low < high")
    }
    if(lowAlarmPercent > highAlarmPercent ){
        return window.alert("Please enter Alarm value low < high")
    }
    // storeSettings()

    // localStorage.setItem("min",minimum)
    // localStorage.setItem("minMultiplier",minMultiplier)
    // localStorage.setItem("max",maximun)
    // localStorage.setItem("maxMultiplier",maxMultiplier)
    // localStorage.setItem("lowAlarmPercent",lowAlarmPercent)
    // localStorage.setItem("highAlarmPercent",highAlarmPercent)
    // localStorage.setItem("lowAlarmChecked",lowAlarmChecked)
    // localStorage.setItem("highAlarmChecked",highAlarmChecked)

    gauge=getCurrentSelected();

    var settings;
    settings = JSON.parse(localStorage.getItem('settings'));

    if(settings == null)
        settings = {};
    

    
    
    var gaugeId = gauge.options.renderTo.id;
    settings[gaugeId] = {}
    
    settings[gaugeId].min = minimum;
    settings[gaugeId].minMultiplier = minMultiplier;
    settings[gaugeId].max = maximun;
    settings[gaugeId].maxMultiplier = maxMultiplier;
    settings[gaugeId].lowAlarmPercent = lowAlarmPercent;
    settings[gaugeId].highAlarmPercent = highAlarmPercent;
    settings[gaugeId].lowAlarmChecked = lowAlarmChecked;
    settings[gaugeId].highAlarmChecked = highAlarmChecked;
    settings[gaugeId].gaugeColor = gaugeColor;
    
    localStorage.setItem('settings',JSON.stringify(settings));

    gauge.options.minValue=min;
    gauge.options.maxValue=max;
    gauge.options.units= unit
    gauge.options.colorPlate= gaugeColor


    if(lowAlarmChecked && highAlarmChecked){
        var lowalarm = calculateAlarm(min,max,lowAlarmPercent);  
        var highalarm = calculateAlarm(min,max,highAlarmPercent);  
        
        gauge.options.highlights[0].from = min
        gauge.options.highlights[0].to = lowalarm
        gauge.options.highlights[1].from = highalarm        
        gauge.options.highlights[1].to = max
    }
    

    else if(highAlarmChecked){
        var highalarm = calculateAlarm(min,max,highAlarmPercent);  
       
            gauge.options.highlights[0].from = ""
            gauge.options.highlights[0].to =""
            gauge.options.highlights[1].from = highalarm        
            gauge.options.highlights[1].to = max
        }
      else  if(lowAlarmChecked){
            var lowalarm = calculateAlarm(min,max,lowAlarmPercent);  
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
    console.log(res)
    arr[i]=Math.ceil(res);       
    res=res+div;
}
arr[n]=max;

return arr;
}

function calculateAlarm(min,max,AlarmPercent){
    minNew= min
    min=Math.abs(min);
    total = min + max;
    AlarmPercentValue = (total*AlarmPercent)/100
    AlarmFinalValue = minNew + AlarmPercentValue
    return AlarmFinalValue
}
// function calculateHighAlarm(min,max,highAlarmPercent){
// minNew= min
// min=Math.abs(min);
// total = min + max;
// maxAlarmPercentValue = (total*highAlarmPercent)/100
// maxAlarmFinalValue = (minNew + maxAlarmPercentValue)
// return maxAlarmFinalValue

// }



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




function getCurrentSelected()
{
    var e = document.getElementById("GaugesSelector");
    var value = e.options[e.selectedIndex].value;

    for(var i=0; i< document.gauges.length;i++ )
    {
        if(document.gauges[i].options.renderTo.id == value)
            return document.gauges[i];
    } 
    
}

function addColor()
{
    let colorInput = document.getElementById('colorInput').value.toLowerCase(); 
    let colorSelect = document.getElementById('GaugeColor');

    if(colorInput =="")
        return; 

     let colorSelectFLAG= false;

        for(let i=0 ; i< colorSelect.options.length; i++)
        {
            if (colorSelect.options[i].value === colorInput )
                {
                    colorSelectFLAG = true;
                    break;
                }
        }

        if(colorSelectFLAG == true)
        {
            
               return;
              
    
        }
        else
        {

           
            
           GaugeColors.push(colorInput); 
           

            var option = document.createElement("OPTION");
 
             localStorage.setItem('GaugeColors',JSON.stringify(GaugeColors));
             option = document.createElement("OPTION");
             option.text = option.value = colorInput;
             colorSelect.appendChild(option);
 
             
 
             
        }

    
}

function addUnit(){
        
    
    let MeasureInput = document.getElementById('MeasureInput').value.toLowerCase();
    let MeasuresSelect = document.getElementById('MeasuresSelect');

    let MeasureUnitInput = document.getElementById('MeasureUnitInput').value.toLowerCase();
    let MesauringUnits = document.getElementById('MesauringUnits');

    let MeasureSecondaryUnitInput = document.getElementById('MeasureSecondaryUnitInput').value.toLowerCase();
    let SecondaryUnits = document.getElementById('SecondaryUnits');

    if(MeasureInput ==""  && (MeasureUnitInput =="" || MeasureSecondaryUnitInput ==""))
        return; 

    
    let MeasuresSelectFLAG= false;

    for(var i=0 ; i< MeasuresSelect.options.length; i++)
    {
        if (MeasuresSelect.options[i].value === MeasureInput )
            {
                MeasuresSelectFLAG = true;
                break;
            }
    }

    let MesauringUnitsFLAG =false;
    if(MeasureUnitInput != ""){
        for(var i=0 ; i< MesauringUnits.options.length; i++)
        {
            if (MesauringUnits.options[i].value === MeasureUnitInput )
               {
                MesauringUnitsFLAG = true;       
                break;
            }
        }
    }

    let SecondaryUnitsFLAG = false;
    if(MeasureSecondaryUnitInput!= ""){
        for(var i=0 ; i< SecondaryUnits.options.length; i++)
        {
            if (SecondaryUnits.options[i].value === MeasureSecondaryUnitInput )
               {
                SecondaryUnitsFLAG = true;
                break;
               } 
        }   
    }


    if(MeasuresSelectFLAG == true)
    {
        if(MeasureUnitInput != "" && MesauringUnitsFLAG==false)
        {
           var MeasuresLocal = JSON.parse(localStorage.getItem('Measures'));

            // MeasuresLocal.MeasureInput = {};  // gauge is already reapeting so no need 
            // MeasuresLocal.MeasureInput.PrimaryMeasuringUnits = [] ; //no need
                                            
                                        
            MeasuresLocal[MeasureInput].PrimaryMeasuringUnits.push(MeasureUnitInput);
            // console.log("In repeat");
            localStorage.setItem('Measures',JSON.stringify(MeasuresLocal));

            option = document.createElement("OPTION");
           option.text = option.value = MeasureUnitInput;
            MesauringUnits.appendChild(option);

            document.getElementById('MeasureInput').value=document.getElementById('MeasureUnitInput').value
                =document.getElementById('MeasureSecondaryUnitInput').value="";
            

            Object.keys(MeasuresLocal).forEach(
                function(key){MeasuresMap.set (key , MeasuresLocal[key]);}
            )
               
            
        }

        if(MeasureSecondaryUnitInput != "" && SecondaryUnitsFLAG==false)
        {
           var MeasuresLocal = JSON.parse(localStorage.getItem('Measures'));
            // MeasuresLocal.MeasureInput.SecondaryMeasuringUnits = [] ;
                                            
            MeasuresLocal[MeasureInput].SecondaryMeasuringUnits.push(MeasureSecondaryUnitInput);
            
            localStorage.setItem('Measures',JSON.stringify(MeasuresLocal));

            option = document.createElement("OPTION");
            option.text = option.value = MeasureSecondaryUnitInput;
            SecondaryUnits.appendChild(option);

            document.getElementById('MeasureInput').value=document.getElementById('MeasureUnitInput').value
                =document.getElementById('MeasureSecondaryUnitInput').value="";

            Object.keys(MeasuresLocal).forEach(
                function(key){MeasuresMap.set (key , MeasuresLocal[key]);}
            )
        }

    }
    else
    {
        if(MeasureUnitInput != "" && MesauringUnitsFLAG==false)
        {
           var MeasuresLocal = JSON.parse(localStorage.getItem('Measures'));

           var option = document.createElement("OPTION");

            if(MeasuresLocal  == null){
                MeasuresLocal= {};   
            }
            
            if(MeasuresLocal[MeasureInput] == undefined){
                MeasuresLocal[MeasureInput]= {} ;

                option.text = MeasureInput;
                option.value = MeasureInput;
                MeasuresSelect.appendChild(option);
            }
                

            MeasuresLocal[MeasureInput].PrimaryMeasuringUnits = [];
                 
            MeasuresLocal[MeasureInput].PrimaryMeasuringUnits.push(MeasureUnitInput);

            localStorage.setItem('Measures',JSON.stringify(MeasuresLocal));

        
            option = document.createElement("OPTION");
            option.text = option.value = MeasureUnitInput;
            MesauringUnits.appendChild(option);

            document.getElementById('MeasureInput').value=document.getElementById('MeasureUnitInput').value
                =document.getElementById('MeasureSecondaryUnitInput').value="";

            Object.keys(MeasuresLocal).forEach(
                function(key){MeasuresMap.set (key , MeasuresLocal[key]);}
            )


        }

        if(MeasureSecondaryUnitInput != "" && SecondaryUnitsFLAG==false)
        {
            MeasuresLocal = JSON.parse(localStorage.getItem('Measures'));

            var option = document.createElement("OPTION");

            if(MeasuresLocal  == null){
                MeasuresLocal= {};   
            }

            if(MeasuresLocal[MeasureInput] == undefined){

                MeasuresLocal[MeasureInput]= {} ;

                option.text = MeasureInput;
                option.value = MeasureInput;
                MeasuresSelect.appendChild(option);
            }
                

                MeasuresLocal[MeasureInput].SecondaryMeasuringUnits = [];
            
                                            
            MeasuresLocal[MeasureInput].SecondaryMeasuringUnits.push(MeasureSecondaryUnitInput);
            
            localStorage.setItem('Measures',JSON.stringify(MeasuresLocal));

            option = document.createElement("OPTION");
            option.text = option.value = MeasureSecondaryUnitInput;
            SecondaryUnits.appendChild(option);

            document.getElementById('MeasureInput').value=document.getElementById('MeasureUnitInput').value
                =document.getElementById('MeasureSecondaryUnitInput').value="";

            Object.keys(MeasuresLocal).forEach(
                function(key){MeasuresMap.set (key , MeasuresLocal[key]);}
            )
        }
        
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

function  MeasuresSelectChange()
    {
        let e = document.getElementById("MeasuresSelect");
        let MeasureName = e.options[e.selectedIndex].value;   

        let PrimaryMeasuringUnits = document.getElementById('MesauringUnits');
        PrimaryMeasuringUnits.innerHTML = "";
        let SecondaryMeasuringUnits = document.getElementById('SecondaryUnits');
        SecondaryMeasuringUnits.innerHTML = "";

        let Units =  MeasuresMap.get(MeasureName);
       
        if(Units != undefined)
        {
            let MesauringUnits = document.getElementById('MesauringUnits');
            Units.PrimaryMeasuringUnits.forEach(
             function(item){
                let option = document.createElement("OPTION");
                option.text = item;
                option.value = item;
                MesauringUnits.appendChild(option);
            })

            let SecondaryUnits = document.getElementById('SecondaryUnits');
            Units.SecondaryMeasuringUnits.forEach(
            function(item){
                let option = document.createElement("OPTION");
                option.text = item;
                option.value = item;
                SecondaryUnits.appendChild(option);
            })

            
        }
    }

    function removeMeasure(){
        let e = document.getElementById("MeasuresSelect");
        let MeasureName = e.options[e.selectedIndex].value;
        e.remove(e.selectedIndex);

        
        let MeasuresLocal = JSON.parse(localStorage.getItem('Measures'));
        delete MeasuresLocal[MeasureName];
        localStorage.setItem('Measures',JSON.stringify(MeasuresLocal));
        MeasuresMap.delete(MeasureName);
    
        e = document.getElementById("MeasuresSelect");
        if(e.length == 0)
        {
            document.getElementById('MesauringUnits').innerHTML = "";
            document.getElementById('SecondaryUnits').innerHTML = "";
            return;
        }
        MeasureName = e.options[e.selectedIndex].value;
        
        let Units =  MeasuresMap.get(MeasureName);

        let MesauringUnits = document.getElementById('MesauringUnits');
        MesauringUnits.innerHTML = "";
            Units.PrimaryMeasuringUnits.forEach(
             function(item){
                let option = document.createElement("OPTION");
                option.text = item;
                option.value = item;
                MesauringUnits.appendChild(option);
            })

            let SecondaryUnits = document.getElementById('SecondaryUnits');
            SecondaryUnits.innerHTML = "";
            Units.SecondaryMeasuringUnits.forEach(
            function(item){
                let option = document.createElement("OPTION");
                option.text = item;
                option.value = item;
                SecondaryUnits.appendChild(option);
            })
      }

      function showAddUnitInputs(){
        var x = document.getElementById("AddUnitInputs");
        if(x.classList.contains('d-none')){
            x.classList.remove('d-none');
            
        }
        else{
            x.classList.add('d-none'); 
        } 
    }