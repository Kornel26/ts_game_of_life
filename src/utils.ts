export class Utils {

    static throttle(callback: Function, limit: number = 300) {
        let wait = false;
        return function (...args: any) {
            if (!wait) {
                callback(...args);
                wait = true;
                setTimeout(function () {
                    wait = false;
                }, limit);
            }
        }
    }

}