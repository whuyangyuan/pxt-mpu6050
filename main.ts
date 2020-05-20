
/*
MPU6050 block
*/
//% weight=20 color=#9900CC icon="\uf13d" block="MPU6050"
namespace MPU6050 {


    export enum REGISTER {
        POWERON = 0x6b,
        GYRO_X = 0x43,
        GYRO_Y = 0x45,
        GYRO_Z = 0x47,
        ACCEL_X = 0x3b,
        ACCEL_Y = 0x3d,
        ACCEL_Z = 0x3f
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

    function initMPU6050(): void {
        i2cWrite(MPU6050_ADDRESS, REGISTER.POWERON, 0)
        initialized = true;
    }


	/**
	 * 设置MPU6050的I2C地址
	 * @param addr [0-1] choose address; eg: MPU6050.MPU6050_I2C_ADDRESS.ADDR_0x68
	*/
    //% blockId="MPU6050_setAddress"
    //% block="set MPU6050 device address %addr"
    //% weight=85
    export function setAddress(addr: MPU6050_I2C_ADDRESS) {
        MPU6050_ADDRESS = addr
        if (!initialized) {
            initMPU6050()
        } 
    }


    /**
	 *Read byte from MPU6050 register
	 * @param reg  register of MPU6050; eg: 0, 15, 23
	*/
    function readByte(reg: REGISTER): number {
        let val = i2cRead(MPU6050_ADDRESS, reg);
        return val;
    }

    /**
	 *Read data from MPU6050 register
	 * @param reg  register of MPU6050; eg: 0, 15, 23
	*/
    function readWord(reg: REGISTER): number {
        let valh = i2cRead(MPU6050_ADDRESS, reg);
        let vall = i2cRead(MPU6050_ADDRESS, reg + 1);
        let val = (valh << 8) + vall
        return val
    }

    /**
	 *Read data from MPU6050 register
	 * @param reg  register of MPU6050; eg: 0, 15, 23
	*/
    function readWord2C(reg: REGISTER): number {
        let val = readWord(reg)
        if (val > 0x8000) {
            return -((65535 - val) + 1)
        } else {
            return val
        }
    }


    /**
	 *Read data from MPU6050 register
	 * @param reg  register of MPU6050; eg: 0, 15, 23
	*/
    //% blockId=MPU6050_readReg 
    //% block="read register |%reg| data"
    //% weight=75
    export function readReg(reg: REGISTER): number {
        let val = i2cRead(MPU6050_ADDRESS, reg);
        return val;
    }

    /**
	 * 获取线性加速度
	*/
    //% blockId=MPU6050_get_accel
    //% block="get axis |%axis| accel data"
    //% weight=75
    export function getAccel(axis: AXIS): number {
        switch (axis) {
            case AXIS.X:
                return readWord2C(REGISTER.ACCEL_X)
            case AXIS.Y:
                return readWord2C(REGISTER.ACCEL_Y)
            case AXIS.Z:
                return readWord2C(REGISTER.ACCEL_Z)
            default:
                return 0
        }
        return 0
    }

    /**
	 * 获取重力加速度
	*/
    //% blockId=MPU6050_get_gyro
    //% block="get axis |%axis| gyro data"
    //% weight=75
    export function getGyro(axis: AXIS): number {
        switch (axis) {
            case AXIS.X:
                return readWord2C(REGISTER.GYRO_X)
            case AXIS.Y:
                return readWord2C(REGISTER.GYRO_Y)
            case AXIS.Z:
                return readWord2C(REGISTER.GYRO_Z)
            default:
                return 0
        }
        return 0
    }

}



