
// Mock product data for Pythronix e-commerce site

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  specifications?: {
    [key: string]: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Category[];
}

export const categories: Category[] = [
  {
    id: "cat1",
    name: "Microcontrollers",
    slug: "microcontrollers",
    subcategories: [
      { id: "cat1-1", name: "Arduino", slug: "arduino" },
      { id: "cat1-2", name: "Raspberry Pi", slug: "raspberry-pi" },
      { id: "cat1-3", name: "ESP8266/ESP32", slug: "esp" }
    ]
  },
  {
    id: "cat2",
    name: "Sensors",
    slug: "sensors",
    subcategories: [
      { id: "cat2-1", name: "Temperature", slug: "temperature-sensors" },
      { id: "cat2-2", name: "Humidity", slug: "humidity-sensors" },
      { id: "cat2-3", name: "Motion", slug: "motion-sensors" },
      { id: "cat2-4", name: "Proximity", slug: "proximity-sensors" }
    ]
  },
  {
    id: "cat3",
    name: "Modules",
    slug: "modules",
    subcategories: [
      { id: "cat3-1", name: "Communication", slug: "communication-modules" },
      { id: "cat3-2", name: "Display", slug: "display-modules" },
      { id: "cat3-3", name: "Relay", slug: "relay-modules" }
    ]
  },
  {
    id: "cat4",
    name: "Electronic Components",
    slug: "electronic-components",
    subcategories: [
      { id: "cat4-1", name: "Resistors", slug: "resistors" },
      { id: "cat4-2", name: "Capacitors", slug: "capacitors" },
      { id: "cat4-3", name: "Transistors", slug: "transistors" },
      { id: "cat4-4", name: "LEDs", slug: "leds" }
    ]
  },
  {
    id: "cat5",
    name: "Development Tools",
    slug: "development-tools",
    subcategories: [
      { id: "cat5-1", name: "Programmers", slug: "programmers" },
      { id: "cat5-2", name: "Debuggers", slug: "debuggers" },
      { id: "cat5-3", name: "Testing Equipment", slug: "testing-equipment" }
    ]
  }
];

export const products: Product[] = [
  {
    id: "prod1",
    name: "Arduino Uno R3",
    price: 499,
    originalPrice: 599,
    description: "Arduino Uno is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header and a reset button. It contains everything needed to support the microcontroller; simply connect it to a computer with a USB cable or power it with an AC-to-DC adapter or battery to get started.",
    shortDescription: "Standard Arduino board for beginners and professionals",
    category: "microcontrollers",
    image: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 243,
    stock: 50,
    featured: true,
    onSale: true,
    specifications: {
      "Microcontroller": "ATmega328P",
      "Operating Voltage": "5V",
      "Digital I/O Pins": "14 (of which 6 provide PWM output)",
      "Analog Input Pins": "6",
      "Clock Speed": "16 MHz",
      "Flash Memory": "32 KB (ATmega328P) of which 0.5 KB used by bootloader"
    }
  },
  {
    id: "prod2",
    name: "Raspberry Pi 4 Model B",
    price: 3999,
    description: "The Raspberry Pi 4 Model B is the latest product in the Raspberry Pi range of single-board computers. It offers ground-breaking increases in processor speed, multimedia performance, memory, and connectivity while retaining backward compatibility and similar power consumption to its predecessors.",
    shortDescription: "Powerful single-board computer with 4GB RAM",
    category: "microcontrollers",
    image: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 187,
    stock: 25,
    featured: true,
    specifications: {
      "Processor": "Broadcom BCM2711, quad-core Cortex-A72 (ARM v8) 64-bit SoC @ 1.5 GHz",
      "Memory": "4GB LPDDR4",
      "Connectivity": "2.4 GHz and 5.0 GHz IEEE 802.11b/g/n/ac wireless LAN, Bluetooth 5.0, BLE",
      "GPIO": "Standard 40-pin GPIO header",
      "Ports": "2 × USB 3.0, 2 × USB 2.0, 2 × micro HDMI, Gigabit Ethernet"
    }
  },
  {
    id: "prod3",
    name: "DHT22 Temperature & Humidity Sensor",
    price: 249,
    originalPrice: 299,
    description: "The DHT22 is a basic digital temperature and humidity sensor. It uses a capacitive humidity sensor and a thermistor to measure the surrounding air and outputs a digital signal on the data pin. It's fairly simple to use but requires careful timing to grab data.",
    shortDescription: "Accurate temp & humidity sensor for IoT projects",
    category: "sensors",
    image: "/placeholder.svg",
    rating: 4.5,
    reviewCount: 94,
    stock: 120,
    onSale: true,
    specifications: {
      "Power Supply": "3.3V to 5.5V DC",
      "Temperature Range": "-40 to 80°C",
      "Humidity Range": "0-100% RH",
      "Temperature Accuracy": "±0.5°C",
      "Humidity Accuracy": "±2% RH"
    }
  },
  {
    id: "prod4",
    name: "ESP32 Development Board",
    price: 399,
    description: "The ESP32 is a powerful microcontroller with WiFi and Bluetooth capabilities, perfect for IoT projects. This development board comes with integrated antenna, USB-to-UART bridge, and all the necessary components to get started quickly.",
    shortDescription: "WiFi & Bluetooth enabled microcontroller",
    category: "microcontrollers",
    image: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 126,
    stock: 80,
    featured: true,
    isNew: true,
    specifications: {
      "CPU": "Xtensa dual-core 32-bit LX6 microprocessor",
      "Clock Frequency": "Up to 240 MHz",
      "Wireless": "WiFi 802.11 b/g/n + Bluetooth 4.2",
      "GPIO": "36 pins",
      "Flash Memory": "4MB"
    }
  },
  {
    id: "prod5",
    name: "HC-SR04 Ultrasonic Sensor",
    price: 79,
    description: "The HC-SR04 ultrasonic sensor uses sonar to determine distance to an object. It offers excellent range accuracy and stable readings in an easy-to-use package. It comes complete with ultrasonic transmitter and receiver modules.",
    shortDescription: "Accurate distance measurement sensor",
    category: "sensors",
    image: "/placeholder.svg",
    rating: 4.3,
    reviewCount: 58,
    stock: 200,
    specifications: {
      "Power Supply": "5V DC",
      "Range": "2cm to 400cm",
      "Accuracy": "3mm",
      "Measuring Angle": "15 degrees",
      "Trigger Input Signal": "10μs TTL pulse"
    }
  },
  {
    id: "prod6",
    name: "16x2 LCD Display Module",
    price: 149,
    description: "This is a 16 character by 2 line LCD display module with blue backlight. It uses the HD44780 LCD controller and can display ASCII characters, Japanese Kana characters, and some symbols. It interfaces easily with any microcontroller using the parallel interface.",
    shortDescription: "Standard character LCD with blue backlight",
    category: "modules",
    image: "/placeholder.svg",
    rating: 4.4,
    reviewCount: 73,
    stock: 90,
    specifications: {
      "Display Format": "16 characters x 2 lines",
      "Display Mode": "STN, Blue, Negative",
      "Backlight": "LED, Blue",
      "Interface": "8-bit parallel or 4-bit parallel",
      "Controller": "HD44780 or equivalent"
    }
  },
  {
    id: "prod7",
    name: "4-Channel Relay Module",
    price: 229,
    originalPrice: 299,
    description: "This 4-channel relay module allows you to control various appliances and equipment with large current. It can be controlled directly by microcontroller like Arduino, AVR, PIC, ARM and more. Each channel has optocoupler isolation for safety.",
    shortDescription: "Control high-voltage devices safely",
    category: "modules",
    image: "/placeholder.svg",
    rating: 4.6,
    reviewCount: 82,
    stock: 45,
    onSale: true,
    specifications: {
      "Input Voltage": "5V DC",
      "Current": "15-20mA per channel",
      "Load Capacity": "10A @ 250VAC or 10A @ 30VDC",
      "Channels": "4 independent relays",
      "Isolation": "Optocoupler"
    }
  },
  {
    id: "prod8",
    name: "Breadboard 830 Points",
    price: 129,
    description: "This solderless breadboard has 830 tie points total, with power rails on both sides. Perfect for building and testing circuits without the need for soldering. Standard 0.1\" spacing makes it compatible with most DIP components and jumper wires.",
    shortDescription: "Large solderless prototyping board",
    category: "electronic-components",
    image: "/placeholder.svg",
    rating: 4.2,
    reviewCount: 41,
    stock: 150,
    specifications: {
      "Tie Points": "830 total",
      "Distribution": "630 tie points + 200 power points",
      "Material": "ABS plastic, phosphor bronze contacts",
      "Size": "165 x 55 x 10mm",
      "Compatibility": "Standard 0.1\" pitch components"
    }
  }
];

export const banners = [
  {
    id: "banner1",
    title: "New Arrivals",
    subtitle: "Check out our latest tech gadgets",
    buttonText: "Shop Now",
    image: "/placeholder.svg",
    link: "/products"
  },
  {
    id: "banner2",
    title: "Summer Sale",
    subtitle: "Get up to 40% off on selected items",
    buttonText: "View Deals",
    image: "/placeholder.svg",
    link: "/sale"
  }
];
