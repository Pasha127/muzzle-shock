The muzzle-shock function will automatically be called whenever large weapons are fired in VBS3.
The muzzle-shock function takes the fired weapon object as an argument.
The function applies concussive effects to soldiers standing too close to the weapon fired.
The effects differ depending whether the soldier is within the “high-effect”, “low-effect”, or “flash” area.
The effects will scale based on the distance from the muzzle according to the inverse-square law. 
The radius (length) of each cone is affected by the weapon caliber 
The angle (arc) of each cone is the same for all weapons 
The effects consist of short-term blindness (max 2 seconds) and deafness (max 60 seconds)

Dependencies:
(allUnits, getVector3Angle, getVector3, setBlindness, setDeafness, calibers) from VBS3

Assumptions:
Each weapon object has the following properties: caliber, muzzle position vector, muzzle direction vector
Each soldier object has the following properties: position vector
There is a "calibers" object that stores data on weapons by caliber and has the following properties: caliber,  lowEffectRadius, highEffectRadius, flashRadius