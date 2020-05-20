
/*
 * MPU6050 block
 */
//% weight=20 color=#9900CC icon="\uf13d" block="MPU6050"
namespace MPU6050 {


    export enum REGISTER {
        POWERON = 0x6b,
        ACCEL_X = 0x3b,
        ACCEL_Y = 0x3d,
        ACCEL_Z = 0x3f,
        TEMPATURE = 0x41,
        GYRO_X = 0x43,
        GYRO_Y = 0x45,
        GYRO_Z = 0x47
    }

    export enum AXIS {
        X = 1,
        Y = 2,
        Z = 3
    }


    export enum MPU6050_I2C_ADDRESS {
        ADDR_0x68 = 0x68,
        ADDR_0x69 = 0x69
    }

    let initialized = false
    let MPU6050_ADDRESS = MPU6050_I2C_ADDRESS.ADDR_0x68


    function i2cWrite(addr: number, reg: number, value: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cRead(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function checkAddress(addr: MPU6050_I2C_ADDRESS): boolean {
        switch (addr) {
            case MPU6050_I2C_ADDRESS.ADDR_0x68:
                return true
            case MPU6050_I2C_ADDRESS.ADDR_0x69:
                return true
            default:
                return false
        }
        return false
    }

    /**
	 * 初始化MPU6050
	 * @param addr [0-1] choose address; eg: MPU6050.MPU6050_I2C_ADDRESS.ADDR_0x68
	*/
    //% blockId="MPU6050_initMPU6050"
    //% block="initialize MPU6050 device address %addr"
    //% weight=85
    export function initMPU6050(addr: MPU6050_I2C_ADDRESS) {
        if (checkAddress(addr)) {
            i2cWrite(MPU6050_ADDRESS, REGISTER.POWERON, 0)
        }
    }

    /**
	 * 复位MPU6050
	 * @param addr [0-1] choose address; eg: MPU6050.MPU6050_I2C_ADDRESS.ADDR_0x68
	*/
    //% blockId="MPU6050_resetMPU6050"
    //% block="reset MPU6050 device address %addr"
    //% weight=85
    export function resetMPU6050(addr: MPU6050_I2C_ADDRESS) {
        if (checkAddress(addr)) {
            i2cWrite(MPU6050_ADDRESS, REGISTER.POWERON, 1)
        }
    }


    /**
	 *Read byte from MPU6050 register
	 * @param reg  register of MPU6050; eg: 0, 15, 23
	*/
    function readByte(addr: MPU6050_I2C_ADDRESS, reg: REGISTER): number {
        let val2 = i2cRead(addr, reg);
        return val2;
    }

    /**
	 *Read data from MPU6050 register
	 * @param reg  register of MPU6050; eg: 0, 15, 23
	*/
    function readWord(addr: MPU6050.MPU6050_I2C_ADDRESS, reg: REGISTER): number {
        let valh = i2cRead(addr, reg);
        let vall = i2cRead(addr, reg + 1);
        let val3 = (valh << 8) + vall
        return val3
    }

    /**
	 *Read data from MPU6050 register
	 * @param reg  register of MPU6050; eg: 0, 15, 23
	*/
    function readWord2C(addr: MPU6050_I2C_ADDRESS, reg: REGISTER): number {
        let val4 = readWord(addr, reg)
        if (val4 > 0x8000) {
            return -((65535 - val4) + 1)
        } else {
            return val4
        }
    }


    /**
    *  读取温度
   */
    //% blockId=MPU6050_readTempature 
    //% block="read tempature for device %addr"
    //% weight=75
    export function readTempature(addr: MPU6050_I2C_ADDRESS): number {
        if (checkAddress(addr)) {
            let value = readWord2C(addr, REGISTER.TEMPATURE)
            return 36.53 + value / 340;
        } else {
            return 0
        }
    }

    /**
	 * 获取线性加速度
	*/
    //% blockId=MPU6050_get_accel
    //% block="get device |%addr| axis |%axis| accel data"
    //% weight=75
    export function getAccel(addr: MPU6050_I2C_ADDRESS, axis: AXIS): number {
        if (checkAddress(addr)) {
            switch (axis) {
                case AXIS.X:
                    return readWord2C(addr, REGISTER.ACCEL_X)
                case AXIS.Y:
                    return readWord2C(addr, REGISTER.ACCEL_Y)
                case AXIS.Z:
                    return readWord2C(addr, REGISTER.ACCEL_Z)
                default:
                    return 0
            }
        }
        return 0
    }

    /**
	 * 获取角速度
	*/
    //% blockId=MPU6050_get_gyro
    //% block="get device |%addr| axis |%axis| gyro data"
    //% weight=75
    export function getGyro(addr: MPU6050_I2C_ADDRESS, axis: AXIS): number {
        if (checkAddress(addr)) {
            switch (axis) {
                case AXIS.X:
                    return readWord2C(addr, REGISTER.GYRO_X)
                case AXIS.Y:
                    return readWord2C(addr, REGISTER.GYRO_Y)
                case AXIS.Z:
                    return readWord2C(addr, REGISTER.GYRO_Z)
                default:
                    return 0
            }
        }
        return 0
    }

}
