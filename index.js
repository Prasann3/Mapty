const form=document.querySelector('.form');
let input_type=document.querySelector('.form__input--type');
const input_distance=document.querySelector('.form__input--distance');
const input_duration=document.querySelector('.form__input--duration');
const input_candence=document.querySelector('.form__input--cadence');
const input_elevation=document.querySelector('.form__input--elevation');
const workout=document.querySelector('.workouts');
const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

class Workout{
    constructor(distance,duration,cords){
        this.distance=distance;
        this.duration=duration;
        this.cords=cords;
        let date=new Date();
        this.date=date;
        this.id=(Date.now()+"").slice(-10);
    }
}
class running extends Workout{
    constructor(distance,duration,cadence,cords){
        super(distance,duration,cords);
        this.cadence=cadence;
        this.pace=this.cal();
    }
    cal(){
        return this.duration/this.distance;
    }
}
class cycling extends Workout{
    constructor(distance,duration,elevation,cords){
        super(distance,duration,cords);
        this.elevation=elevation;
        this.speed=this.cal();
    }
    cal(){
        return this.duration/this.distance;
    }
}


class App{
    #map;
    mapevent;
    #Workouts;
    constructor(){
        this.#Workouts=new Array();
        this._get_position();
        input_type.addEventListener('change',this._toggle_elevation);
        form.addEventListener('submit',this._new_workout.bind(this));
        workout.addEventListener('click',this.setView.bind(this));
        // this._get_local();
    }

    _get_position(){

        navigator.geolocation.getCurrentPosition(this._load_map.bind(this),function(){
            alert("Cant load your position");
        })

    }

    _load_map(pos){

         let{latitude}=pos.coords;
         let{longitude}=pos.coords;
         let cord=new Array();
         cord.push(latitude);
         cord.push(longitude);
         this.#map = L.map('map').setView(cord, 13);
    
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        
        L.marker(cord).addTo(this.#map)
            .bindPopup('Your loacation')
            .openPopup();

        this.#map.on('click',this._show_form.bind(this));

    }

    _show_form(p){
        this.mapevent=p;
        
        form.classList.remove('hidden');
        
    }

    _toggle_elevation(){
        input_elevation.closest('.form__row').classList.toggle('form__row--hidden');
        input_candence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _new_workout(e){

        e.preventDefault();
        
        let type=input_type.value;
        let cadence=input_candence.value;
        let distance=input_distance.value;
        let duration=input_duration.value;
        let elevation=input_elevation.value;
        input_candence.value=input_distance.value= input_duration.value=input_elevation.value="";
        let {lat,lng}=this.mapevent.latlng;
            
            L.marker([lat,lng]).addTo(this.#map).bindPopup(
                L.popup({
                autoClose:false,
                closeOnClick:false,
                className:`${type}-popup`
            })).setPopupContent(`${type}`).openPopup(); 
       
            if(type==='running'){  
                if(cadence && distance && duration){
                    let work={
                        type:"running",
                        distance:distance,
                        duration:duration,
                        l:cadence,
                        cords:[lat,lng]
                    }
                    this._renderworkout(work);
                    // this._set_local();
                 
                }   
        
                else alert("Enter positive values");
    }
   

    if(type=='cycling'){
        if(distance && duration && elevation){

            let work={
                type:"cycling",
                distance:distance,
                duration:duration,
                l:elevation,
                cords:[lat,lng]
            }
            this._renderworkout(work);
            // this._set_local();
    }
    else alert("Enter positive number");
}

    form.classList.add('hidden');
}
   
   _renderworkout(work){
         if(work.type=="running"){
            let r=new running(work.distance,work.duration,work.l,work.cords);
            this.#Workouts.push(r);

            const html=`<li class="workout workout--running" data-id="${r.id}">
            <h2 class="workout__title">Running on ${new Date().getDate()} ${months[new Date().getMonth()]}</h2>
            <div class="workout__details">
              <span class="workout__icon">🏃‍♂️</span>
              <span class="workout__value">${work.distance}</span>
              <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${work.duration}</span>
              <span class="workout__unit">min</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${(work.duration/work.distance).toFixed(1)}</span>
              <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">🦶🏼</span>
              <span class="workout__value">${work.l}</span>
              <span class="workout__unit">spm</span>
            </div>
          </li>`
          
         form.insertAdjacentHTML('afterend',html);
         
         }
         else{
            let c=new running(work.distance,work.duration,work.l,work.cords);
            this.#Workouts.push(c);
        const html=`<li class="workout workout--cycling" data-id="${c.id}">
          <h2 class="workout__title">Cycling on  ${new Date().getDate()} ${months[new Date().getMonth()]}</h2>
          <div class="workout__details">
            <span class="workout__icon">🚴‍♀️</span>
            <span class="workout__value">${work.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${work.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${(work.duration/work.distance).toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${work.l}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;
        form.insertAdjacentHTML("afterend",html); 
      
         }
   }

   setView(e){
    
    if(!form.classList.contains('hidden'))return;
    let target=e.target.closest('.workout');
    
    if(!target.classList.contains('workout'))return;
    let id=target.dataset.id;
    
    let mal=this.#Workouts.find((ele)=>{
        if(ele.id==id){
            return true; 
        }
        else return false;
    });
     
      let cord=[];
      cord.push(mal.cords[0]);
      cord.push(mal.cords[1]);
     
     this.#map.setView(cord,13);
   }
   _set_local(){
    localStorage.setItem('workouts',JSON.stringify(this.#Workouts));
   }
   _get_local(){
    let data=JSON.parse(localStorage.getItem('workouts'));
    if(!data)return;
    console.log(data);
    this.#Workouts=data;
    this.#Workouts.forEach((ele)=>{
       this._renderworkout(ele);
    })
   }
   reset(){
    localStorage.clear();
   }
}

const app=new App();





