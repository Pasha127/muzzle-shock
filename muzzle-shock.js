import {allUnits, getVector3Angle, getVector3, setBlindness, setDeafness, calibers} from VBS3;

const dBAtUnit = (caliber, distance) => {
    // Volume of weapon experienced by unit based on weapon caliber and distance from source
    const dBAtSource = calibers[caliber.toString()].dB;                                     // dB at source for weapon caliber
    const dropoff = 20 * Math.log10(distance);                                              // dropoff in dB due to inverse square law (6dB per doubling of distance)
    const dB = dBAtSource - dropoff;                                                        // dB experienced by unit
    //console.log(`The volume experienced by ${unit.id} from a ${caliber} weapon is ${dB} db`);
    return dB;   
  };


const muzzleShock = (weapon) => {
    // constants assumed to be constant for all weapons
    const highEfectAngle = 60; // constant effect angle for all weapons as specced in the task - based on estimate from image in task
    const lowEfectAngle = 135; // constant effect angle for all weapons as specced in the task - based on estimate from image in task
    //following variables are based on weapon caliber and are assumed to be constant for all weapons of a given caliber
    const lowEffectRadius = calibers[weapon.caliber.toString()].lowEffectRadius; // effect radius for weapon based on weapon caliber
    const highEffectRadius = calibers[weapon.caliber.toString()].highEffectRadius; // effect radius for weapon based on weapon caliber
    const flashRadius = calibers[weapon.caliber.toString()].flashRadius; // effect radius for weapon based on weapon caliber


    allUnits?.forEach(soldier => {
        const distance = getVector3(weapon.muzzlePos).distanceTo(getVector3(soldier.position));           // distance in meters between source and unit
        if(distance < highEffectRadius) {                                                                 // only calculate effect if unit is within high effect radius
            const angleToUnit = getVector3Angle(weapon.muzzlePos, weapon.muzzleDir, soldier.position);    // angle in degrees between weapon muzzle vector and unit
            const dB = dBAtUnit(weapon.caliber, distance);
            const secondsOfDeafness = dB / 2;                                                          //seconds of deafness based on dB - not tied to any real formula
            //switch statement to determine which effect to apply based on angle to unit and distance to unit
            switch (angleToUnit) {
                case angleToUnit < (highEfectAngle):                    
                        // apply high effect & flash blindness
                        secondsOfDeafness > 60 ? setDeafness(soldier, 60) : setDeafness(soldier, secondsOfDeafness); // apply deafness effect capped at 60 seconds
                        //blindness duration is set to 2 seconds in flash zone & uses inverse square law to determine reduced blindness duration past flash zone
                        const blindnessDuration = 1 / (distance * distance);
                        distance < flashRadius ? setBlindness(soldier, 2) :  setBlindness(soldier, blindnessDuration); // apply blindness effect
                    break;

                case angleToUnit > (highEfectAngle) && angleToUnit < (lowEfectAngle) && distance < lowEffectRadius:    //apply reduced effect if unit is within low effect radius 
                    // apply low effect
                    secondsOfDeafness > 30 ? setDeafness(soldier, 30) : setDeafness(soldier, secondsOfDeafness/2); // apply reduced deafness effect capped at 30 seconds
                    break;
                default:
                    break;
            }
        }
        });
    };

