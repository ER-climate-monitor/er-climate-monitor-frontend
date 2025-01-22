interface Sensor { 
    ip: string,
    name: string,
    port: number
}

class BasicSensor implements Sensor {
    ip: string;
    name: string;
    port: number;

    constructor(ip: string, port: number, name: string = 'unknown') { 
        this.ip = ip;
        this.port = port;
        this.name = name
    }
}

export { BasicSensor, type Sensor }
