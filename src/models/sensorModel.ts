interface Sensor {
    ip: string;
    name: string;
    port: string;
}

class BasicSensor implements Sensor {
    ip: string;
    name: string;
    port: string;

    constructor(ip: string, port: string, name: string = 'unknown') {
        this.ip = ip;
        this.port = port;
        this.name = name;
    }
}

export { BasicSensor, type Sensor };
