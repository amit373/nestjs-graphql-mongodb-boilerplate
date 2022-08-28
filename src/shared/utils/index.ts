import { randomInt } from 'crypto';

export const getEnv = (key: string): string => {
    if (isEmpty(process.env[key])) {
        throw new Error(`Environment variable ${key} is not set.`);
    }
    return process.env[key];
};

export const getEnvOptional = (key: string): string => process.env[key];

export const toNumber = (value: string): number => parseInt(value, 10);

export const toInteger = (value: string): number => {
    if (isNaN(parseInt(value, 10))) {
        return 0;
    }
    return parseInt(value, 10);
};

export const toBool = (value: string): boolean => value === 'true';

export const isNull = (value: string) => value === 'null' || value === null;

export const isUndefined = (value: string): boolean =>
    value === undefined || value === 'undefined';

export const isEmpty = (value: string): boolean =>
    isUndefined(value) || isNull(value) || value === '';

export const isString = (value: any) => typeof value === 'string';

export const isNumber = (value: any) => typeof value === 'number';

export const isValidInt = (value: any): boolean => toInteger(value) !== 0;

export const normalizePort = (port: string): string | number | boolean => {
    const parsedPort = parseInt(port, 10);
    if (Number.isNaN(parsedPort)) {
        return port;
    }
    if (parsedPort >= 0) {
        return parsedPort;
    }
    return false;
};

/**
 * Generate OTP of the length
 * @param  {number} length length of password.
 * @param  {object} options
 * @param  {boolean} options.digits Default: `true` true value includes digits in OTP
 * @param  {boolean} options.lowerCaseAlphabets Default: `true` true value includes lowercase alphabets in OTP
 * @param  {boolean} options.upperCaseAlphabets Default: `true` true value includes uppercase alphabets in OTP
 * @param  {boolean} options.specialChars Default: `true` true value includes specialChars in OTP
 * @param  {boolean} options.onlyNumbers Default: `true` true value includes only number digits in OTP
 */
export function generateOtp(
    length = 6,
    options = {
        digits: true,
        upperCaseAlphabets: true,
        specialChars: false,
        lowerCaseAlphabets: false,
        onlyNumbers: true,
    }
) {
    const digits = '0123456789';
    const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseAlphabets = lowerCaseAlphabets.toUpperCase();
    const specialChars = '#!&@';
    const stringLength: number = length || 6;
    const generateOptions: any = options || {};

    generateOptions.digits = Object.prototype.hasOwnProperty.call(
        generateOptions,
        'digits'
    )
        ? options.digits
        : true;
    generateOptions.lowerCaseAlphabets = Object.prototype.hasOwnProperty.call(
        generateOptions,
        'lowerCaseAlphabets'
    )
        ? options.lowerCaseAlphabets
        : true;
    generateOptions.upperCaseAlphabets = Object.prototype.hasOwnProperty.call(
        generateOptions,
        'upperCaseAlphabets'
    )
        ? options.upperCaseAlphabets
        : true;
    generateOptions.specialChars = Object.prototype.hasOwnProperty.call(
        generateOptions,
        'specialChars'
    )
        ? options.specialChars
        : true;

    let allowsChars = '';
    if (options?.onlyNumbers) {
        allowsChars = (generateOptions.digits || '') && digits;
    } else {
        allowsChars =
            ((generateOptions.digits || '') && digits) +
            ((generateOptions.lowerCaseAlphabets || '') && lowerCaseAlphabets) +
            ((generateOptions.upperCaseAlphabets || '') && upperCaseAlphabets) +
            ((generateOptions.specialChars || '') && specialChars);
    }
    let password = '';
    while (password.length < stringLength) {
        const charIndex = randomInt(0, allowsChars?.length);
        password += allowsChars[charIndex];
    }
    return password;
}

/**
 * Generate slug of string
 * @param  {string} string string to create a slug
 * @param  {object} options
 * @param  {string} options.replacement replace spaces with replacement character, defaults to `-`.
 * @param  {RegExp} options.remove remove characters that match regex, defaults to `undefined`
 * @param  {boolean} options.lower convert to lower case, defaults to `false`
 * @param  {boolean} options.strict strip special characters except replacement, defaults to `false`
 * @param  {string} options.locale language code of the locale to use
 * @param  {boolean} options.trim trim leading and trailing replacement chars, defaults to `true`
 */
export function slugify(
    string: string,
    options?:
        | {
              replacement?: string;
              remove?: RegExp;
              lower?: boolean;
              strict?: boolean;
              locale?: string;
              trim?: boolean;
          }
        | string
): string {
    const charMap = JSON.parse(
        '{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","Ա":"A","Բ":"B","Գ":"G","Դ":"D","Ե":"E","Զ":"Z","Է":"E\'","Ը":"Y\'","Թ":"T\'","Ժ":"JH","Ի":"I","Լ":"L","Խ":"X","Ծ":"C\'","Կ":"K","Հ":"H","Ձ":"D\'","Ղ":"GH","Ճ":"TW","Մ":"M","Յ":"Y","Ն":"N","Շ":"SH","Չ":"CH","Պ":"P","Ջ":"J","Ռ":"R\'","Ս":"S","Վ":"V","Տ":"T","Ր":"R","Ց":"C","Փ":"P\'","Ք":"Q\'","Օ":"O\'\'","Ֆ":"F","և":"EV","ء":"a","آ":"aa","أ":"a","ؤ":"u","إ":"i","ئ":"e","ا":"a","ب":"b","ة":"h","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ى":"a","ي":"y","ً":"an","ٌ":"on","ٍ":"en","َ":"a","ُ":"u","ِ":"e","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","پ":"p","چ":"ch","ژ":"zh","ک":"k","گ":"g","ی":"y","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ṣ":"S","ṣ":"s","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","–":"-","‘":"\'","’":"\'","“":"\\"","”":"\\"","„":"\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial","ﻵ":"laa","ﻷ":"laa","ﻹ":"lai","ﻻ":"la"}'
    );
    const locales = JSON.parse(
        '{"bg":{"Й":"Y","Ц":"Ts","Щ":"Sht","Ъ":"A","Ь":"Y","й":"y","ц":"ts","щ":"sht","ъ":"a","ь":"y"},"de":{"Ä":"AE","ä":"ae","Ö":"OE","ö":"oe","Ü":"UE","ü":"ue","ß":"ss","%":"prozent","&":"und","|":"oder","∑":"summe","∞":"unendlich","♥":"liebe"},"es":{"%":"por ciento","&":"y","<":"menor que",">":"mayor que","|":"o","¢":"centavos","£":"libras","¤":"moneda","₣":"francos","∑":"suma","∞":"infinito","♥":"amor"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","¢":"centime","£":"livre","¤":"devise","₣":"franc","∑":"somme","∞":"infini","♥":"amour"},"pt":{"%":"porcento","&":"e","<":"menor",">":"maior","|":"ou","¢":"centavo","∑":"soma","£":"libra","∞":"infinito","♥":"amor"},"uk":{"И":"Y","и":"y","Й":"Y","й":"y","Ц":"Ts","ц":"ts","Х":"Kh","х":"kh","Щ":"Shch","щ":"shch","Г":"H","г":"h"},"vi":{"Đ":"D","đ":"d"},"da":{"Ø":"OE","ø":"oe","Å":"AA","å":"aa","%":"procent","&":"og","|":"eller","$":"dollar","<":"mindre end",">":"større end"},"nb":{"&":"og","Å":"AA","Æ":"AE","Ø":"OE","å":"aa","æ":"ae","ø":"oe"},"it":{"&":"e"},"nl":{"&":"en"},"sv":{"&":"och","Å":"AA","Ä":"AE","Ö":"OE","å":"aa","ä":"ae","ö":"oe"}}'
    );
    if (typeof string !== 'string') {
        throw new Error('slugify: string argument expected');
    }

    options =
        typeof options === 'string' ? { replacement: options } : options || {};

    const locale: { [key: string]: string } = locales[options.locale] || {};

    const replacement: string =
        options.replacement === undefined ? '-' : options.replacement;

    const trim: boolean = options.trim === undefined ? true : options.trim;

    const lower: boolean = options.lower === undefined ? true : options.lower;

    let slug: string = string
        .normalize()
        .split('')
        // replace characters based on charMap
        .reduce((result, ch) => {
            let appendChar: string = locale[ch] || charMap[ch] || ch;
            if (appendChar === replacement) {
                appendChar = ' ';
            }
            return (
                result +
                appendChar
                    // remove not allowed characters
                    .replace(
                        options['remove'] || /[^\w\s$*_+~.()'"!\-:@]+/g,
                        ''
                    )
            );
        }, '');

    if (options.strict) {
        slug = slug.replace(/[^A-Za-z0-9\s]/g, '');
    }

    if (trim) {
        slug = slug.trim();
    }

    // Replace spaces with replacement character, treating multiple consecutive
    // spaces as a single space.
    slug = slug.replace(/\s+/g, replacement);

    if (lower) {
        slug = slug.toLowerCase();
    }

    return slug;
}
