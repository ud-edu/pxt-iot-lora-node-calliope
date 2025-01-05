/*
* pxt-iot-lora node, Micro:Bit library for IoTLoRaNode
* Copyright (C) 2018-2020  Pi Supply
* Changes for Calliope mini 8.5.2020 M. Klein
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
* Last Updated 2020-02-13-1520
*/

enum Channels {
    //% block="One"    
    One = 1,
    //% block="Two"
    Two = 2,
    //% block="Three"
    Three = 3,
    //% block="Four"
    Four = 4,
    //% block="Five"
    Five = 5,
    //% block="Six"
    Six = 6,
    //% block="Seven"
    Seven = 7,
    //% block="Eight"
    Eight = 8,
    //% block="Nine"
    Nine = 9,
    //% block="Ten"
    Ten = 10,
    //% block="Eleven"
    Eleven = 11,
    //% block="Twelve"
    Twelve = 12,
    //% block="Thirteen"
    Thirteen = 13,
    //% block="Fourteen"
    Fourteen = 14,
    //% block="Fifteen"
    Fifteen = 15,
    //% block="Sixteen"
    Sixteen = 16,
    //% block="Seventeen"
    Seventeen = 17,
    //% block="Eighteen"
    Eighteen = 18,
    //% block="Nineteen"
    Nineteen = 19,
    //% block="Twenty"
    Twenty = 20

}

enum MeasuredValue {
    //% block="Analogue"
    Analogue,
    //% block="Temperature"
    Temperature,
    //% block="Barometer"
    Barometer,
    //% block="Humidity"
    Humidity,
    //% block="Light"
    Light
}

enum BoolValue {
    //% block="Digital Value"
    digital,
    //% block="Presence Sensor"
    presence
}

enum Modul {
    wio_e5_01,
    wio_e5_02,
    wio_e5_03,
    wio_e5_04,
    wio_e5_05
}

//% weight=10 color=#8bc34a icon="\uf1eb"
namespace IotLoRaNode {
    serial.redirect(SerialPin.C17, SerialPin.C16, BaudRate.BaudRate9600); // C16/C17
    let payload = ""

    //%blockId="IotLoRaNode_eigene_Hardware_Module"
    //%block="Initialisiere LoRaWAN-Modul: %modul"
    export function InitModule(modul: Modul){
        switch(modul) {
            case Modul.wio_e5_01:
                InitialiseRadioOTAA("bitte DevEUI1 eintragen","hier bitte Appkey1 eintragen");
                break;
            case Modul.wio_e5_02:
                InitialiseRadioOTAA("DevEUI2", "Appkey2");
                break;
            case Modul.wio_e5_03:
                InitialiseRadioOTAA("...", "...");
                break;
            case Modul.wio_e5_04:
                InitialiseRadioOTAA("", "");
                break;
            case Modul.wio_e5_05:
                InitialiseRadioOTAA("", "");
                break;
        }
    }


    //%blockId="IotLoRaNode_InitialiseRadioOTAA" block="Initialise LoRa Radio via OTAA:|Device Eui %deveui|App Key %appkey"
    //% blockGap=8
    export function InitialiseRadioOTAA(deveui: string, appkey: string): void {

        basic.pause(75)
        //Set to use LoRaWAN Mode 
        serial.writeString("AT+MODE=LWOTAA\r\n");
        serial.readLine()

        basic.pause(75)
        //Set to use LoRaWAN Mode
        serial.writeString("AT+DR=EU868\r\n");
        serial.readLine()

        basic.pause(75)
        //Set to use LoRaWAN Mode
        serial.writeString("AT+CH=NUM,0-2\r\n");
        serial.readLine()

        basic.pause(75)
        //Set the application session key
        serial.writeString("AT+KEY=APPKEY," + appkey + "\r\n");
        serial.readLine()

        basic.pause(75)
        //Set the device extended unique identifier
        serial.writeString("AT+ID=DEVEUI," + deveui + "\r\n");
        serial.readLine()

        basic.pause(75)
        //Set the application session key
        serial.writeString("AT+CLASS=C\r\n");
        serial.readLine()

        basic.pause(75)
        //Set the application session key
        serial.writeString("AT+PORT=8\r\n");
        serial.readLine()

        basic.pause(75)
        //"Join" the LoRaWAN Network in ABP Mode
        serial.writeString("AT+JOIN\r\n");
        serial.readLine()

        //Display on the screen that LoRa is ready.
        basic.showString("LoRa Ready")
    }

    //%blockId="IotLoRaNode_AssembleMeasuredValue" block="Add %quantity Value: %value on channel: %chanNum" value.min=0 value.max=254
    export function AssembleMeasuredValue(quantity: MeasuredValue, value: number, chanNum: Channels): void {
        /**
         * Add measured value
         */
        let buffer: number;
        let format: NumberFormat;
        let faktor: number;
        let cn: string;
        switch (quantity) {
            case (MeasuredValue.Light):
                buffer = 2;
                format = NumberFormat.Int16BE;
                faktor = 1;
                cn = "65";
                break;
            case (MeasuredValue.Humidity):
                buffer = 1;
                format = NumberFormat.UInt8BE;
                faktor = 2;
                cn = "68";
                break;
            case (MeasuredValue.Barometer):
                buffer = 2;
                format = NumberFormat.Int16BE;
                faktor = 10;
                cn = "73";
                break;
            case (MeasuredValue.Temperature):
                buffer = 2;
                format = NumberFormat.Int16BE;
                faktor = 10;
                cn = "67";
                break;
            default: // Analogue
                buffer = 2;
                format = NumberFormat.Int16BE;
                faktor = 100;
                cn = "02"; 
        }

        let bufr = pins.createBuffer(buffer);
        bufr.setNumber(format, 0, (value * faktor));
        payload = payload + "0" + chanNum + cn + bufr.toHex();
    }


    //%blockId="IotLoRaNode_AssembleBoolValue" block="Add %sensor: %value on channel: %chanNum"
    export function AssembleBoolValue(sensor: BoolValue, value: boolean, chanNum: Channels): void {
        /**
         * Add boolean value
         */
        let intVal = value ? 1 : 0;
        let cn = "000";
        if (sensor == BoolValue.presence) { cn = "660"; }
        payload = payload + "0" + chanNum + cn + intVal;
    }
    


    //%blockId="IotLoRaNode_AccelorometerValue" block="Add Accelerometer Value|X: %accelValX Y: %accelValY Z: %accelValZ to channel: %hanNum" advanced=true
    export function AccelorometerValue(accelValX: number, accelValY: number, accelValZ: number, chanNum: Channels): void {
        /**
         * Add accelorometer
         */
        let bufr = pins.createBuffer(6);
        bufr.setNumber(NumberFormat.Int16BE, 0, (accelValX * 100))
        bufr.setNumber(NumberFormat.Int16BE, 2, (accelValY * 100))
        bufr.setNumber(NumberFormat.Int16BE, 4, (accelValZ * 100))

        payload = payload + "0" + chanNum + "71" + bufr.toHex();

    }


    //%blockId="IotLoRaNode_GPS" block="Add GPS Value|Latitude: %latitude Longitude %longitude Altitude %altitude on channel: %chanNum" advanced=true
    //% blockGap=8
    export function GPS(latitude: number, longitude: number, altitude: number, chanNum: Channels): void {
        /**
         * Add GPS value
         */
        let latBuf = pins.createBuffer(4);
        latBuf.setNumber(NumberFormat.Int32BE, 0, longitude * 10000)
        let latBuf2 = latBuf.slice(1, 4);

        let lonBuf = pins.createBuffer(4);
        lonBuf.setNumber(NumberFormat.Int32BE, 0, latitude * 10000)
        let lonBuf2 = lonBuf.slice(1, 4);
        let altBuf = pins.createBuffer(4);
        altBuf.setNumber(NumberFormat.Int32BE, 0, altitude * 100)
        let altBuf2 = altBuf.slice(1, 4);
        payload = "" + payload + "0" + chanNum + "88" + lonBuf2.toHex() + latBuf2.toHex() + altBuf2.toHex()

    }

    //%blockId="IotLoRaNode_TransmitMessage" block="Transmit LoRa Data"
    export function loraTransmitPayload(): void {
        /**
         * Transmit Message
         */

        serial.writeString("AT+CMSGHEX=" + payload + "\r\n");
        serial.readUntil(serial.delimiters(Delimiters.NewLine))
        basic.pause(100)
        payload = ""
    }

}
