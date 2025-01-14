# murr-impact67pro-iolink-api

A collection of various nodes which can be used as a Free example with the Murr IMPACT67 Pro module from Murr Electronic. The nodes where tested with the Hardwareversion 1.0.0 and Softwareversion 1.7.1.

Every Nodes has an html help included which you can refer to, as well as the below shown example.

Fur further details please refer to the murr elektronik homepage:

``https://www.murrelektronik.com/de/``



## Beispiel Flow

```json
[
    {
        "id": "70726e658e5c1d10",
        "type": "tab",
        "label": "Flow 4",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "c7465c3de07c3848",
        "type": "extract-data",
        "z": "70726e658e5c1d10",
        "dataType": 0,
        "bitOffset": "2",
        "Label": "Pressure Value",
        "bitLength": "14",
        "gradient": "0.010000",
        "x": 1610,
        "y": 520,
        "wires": [
            [
                "9fd842d1a8b9c49f"
            ]
        ]
    },
    {
        "id": "993215266675018d",
        "type": "inject",
        "z": "70726e658e5c1d10",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 1060,
        "y": 520,
        "wires": [
            [
                "e5bffb713c37ab4a"
            ]
        ]
    },
    {
        "id": "e5bffb713c37ab4a",
        "type": "get-processdata",
        "z": "70726e658e5c1d10",
        "name": "get-processdata",
        "ip": "192.168.0.2",
        "devicealias": "master1port1",
        "x": 1340,
        "y": 520,
        "wires": [
            [
                "c7465c3de07c3848"
            ]
        ]
    },
    {
        "id": "9fd842d1a8b9c49f",
        "type": "debug",
        "z": "70726e658e5c1d10",
        "name": "debug 5",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1820,
        "y": 520,
        "wires": []
    },
    {
        "id": "d5f7ab4ad1465790",
        "type": "inject",
        "z": "70726e658e5c1d10",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 1040,
        "y": 180,
        "wires": [
            [
                "aab964e767a1fcf7"
            ]
        ]
    },
    {
        "id": "aab964e767a1fcf7",
        "type": "get-devicealias",
        "z": "70726e658e5c1d10",
        "name": "get-devicealias",
        "ip": "192.168.0.2",
        "x": 1460,
        "y": 180,
        "wires": [
            [
                "3d20947706bc4a31"
            ]
        ]
    },
    {
        "id": "3d20947706bc4a31",
        "type": "debug",
        "z": "70726e658e5c1d10",
        "name": "debug 6",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1820,
        "y": 180,
        "wires": []
    },
    {
        "id": "5bb03ff325fc4d70",
        "type": "write-portconfig",
        "z": "70726e658e5c1d10",
        "name": "write-portconfig",
        "ip": "192.168.0.2",
        "user": "admin",
        "password": "private",
        "port": "1",
        "devicealias": "master1port1",
        "pin4mode": "IOLINK_AUTOSTART",
        "pin2mode": "DIGITAL_INPUT",
        "x": 1460,
        "y": 320,
        "wires": [
            [
                "6868b39fe2cfb296"
            ]
        ]
    },
    {
        "id": "6868b39fe2cfb296",
        "type": "debug",
        "z": "70726e658e5c1d10",
        "name": "debug 7",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1820,
        "y": 320,
        "wires": []
    },
    {
        "id": "9af014e7564ba396",
        "type": "inject",
        "z": "70726e658e5c1d10",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 1040,
        "y": 320,
        "wires": [
            [
                "5bb03ff325fc4d70"
            ]
        ]
    },
    {
        "id": "83e0fc567e7b2dd1",
        "type": "comment",
        "z": "70726e658e5c1d10",
        "name": "Comment for Devicealias",
        "info": "\"Read out all the available DeviceAlias \nof the ports.\nThe deviceAlias is used in other function\ne.g getprocessdata\"",
        "x": 1450,
        "y": 120,
        "wires": []
    },
    {
        "id": "5a79cac86ab6933a",
        "type": "comment",
        "z": "70726e658e5c1d10",
        "name": "Comment for Port Config",
        "info": "\"Sets the frst port on the IO-Link master to IO-Link and PIN2 as digital input\"\n\"The portconfiguration is permant and need to be done just once, you can also read out the \ncurrent port config with get-portconfig and again change if needed\"",
        "x": 1470,
        "y": 260,
        "wires": []
    },
    {
        "id": "973ce1c2144f0431",
        "type": "comment",
        "z": "70726e658e5c1d10",
        "name": "Comment for get processdata",
        "info": "\"Read out the raw processdata of a 2Byte Input IO-Link pressure sensor\"",
        "x": 1340,
        "y": 480,
        "wires": []
    },
    {
        "id": "1b31efb73c6b9b04",
        "type": "comment",
        "z": "70726e658e5c1d10",
        "name": "Comment for get processdata",
        "info": "The extract data node is used to extract the 14Bit Pressure value with a two bitOffset (according to the manual);\nalso the pressure switch has a gardient (mulitplier) to read out the pressure value in bar.",
        "x": 1620,
        "y": 480,
        "wires": []
    },
    {
        "id": "db8ac9fb4c309a07",
        "type": "write-portconfig",
        "z": "70726e658e5c1d10",
        "name": "write-portconfig",
        "ip": "192.168.0.2",
        "user": "admin",
        "password": "private",
        "port": "8",
        "devicealias": "master1port8",
        "pin4mode": "IOLINK_AUTOSTART",
        "pin2mode": "DIGITAL_OUTPUT",
        "x": 1460,
        "y": 880,
        "wires": [
            [
                "184172c8f7b3988f"
            ]
        ]
    },
    {
        "id": "184172c8f7b3988f",
        "type": "debug",
        "z": "70726e658e5c1d10",
        "name": "debug 8",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1820,
        "y": 880,
        "wires": []
    },
    {
        "id": "5d8bca8cef28b182",
        "type": "inject",
        "z": "70726e658e5c1d10",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 1040,
        "y": 880,
        "wires": [
            [
                "db8ac9fb4c309a07"
            ]
        ]
    },
    {
        "id": "77d84e234ff0e86d",
        "type": "comment",
        "z": "70726e658e5c1d10",
        "name": "Comment for Port Config",
        "info": "\"Sets the last port on the IO-Link master to IO-Link and PIN2 as digital output\"\n\"The portconfiguration is permant and need to be done just once, you can also read out the \ncurrent port config with get-portconfig and again change if needed\"",
        "x": 1470,
        "y": 820,
        "wires": []
    },
    {
        "id": "333354c7ab06d508",
        "type": "write-processdata",
        "z": "70726e658e5c1d10",
        "name": "write-processdata",
        "ip": "192.168.0.2",
        "user": "admin",
        "password": "private",
        "devicealias": "master1port8",
        "processData": "[73,74,75,76,79,18,1,0]",
        "valuePin2": "false",
        "x": 1470,
        "y": 1060,
        "wires": [
            []
        ]
    },
    {
        "id": "17c0eba20b8af51d",
        "type": "inject",
        "z": "70726e658e5c1d10",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 1040,
        "y": 1060,
        "wires": [
            [
                "333354c7ab06d508"
            ]
        ]
    },
    {
        "id": "1d87cfd6c39a2e88",
        "type": "comment",
        "z": "70726e658e5c1d10",
        "name": "Comment for Write Processdata",
        "info": "Write 8 Byte Outputprocessdata to the Modlight 60 from murr so that the lamp will operate in stacklight mode:\nPlease note you have to cyclic write processdata otherwise it will be set zero after a timeout.",
        "x": 1490,
        "y": 1000,
        "wires": []
    }
]
```

## Installation

``npm i node-red-contrib-murr-impact67pro-iolink-api``

## Voraussetzungen
- Node-RED >= V2.0.0

## Disclaimer

The code provided in this example is for educational and informational purposes only. It is not guaranteed to be error-free, accurate, or complete. The author makes no warranties, express or implied, regarding the code's performance, suitability, or fitness for a particular purpose. Use of the code is at your own risk. The author shall not be liable for any damages, including but not limited to indirect, incidental, or consequential damages, arising out of the use or inability to use the code. It is your responsibility to thoroughly test and validate the code before using it in any production environment
