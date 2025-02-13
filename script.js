'use strict';

document.addEventListener('DOMContentLoaded', function() {
    let currentCypher = {};
    let currentUserInput = JSON.parse(sessionStorage.getItem("currentUserInput")) || {};
    let lastUsedFamily = sessionStorage.getItem("lastUsedFamily") || null;


   const textAreaInput = document.querySelector('#user_input');
   const textAreaInputBtn1 = textAreaInput.nextElementSibling.querySelectorAll('button')[0];
   const textAreaInputBtn2 = textAreaInput.nextElementSibling.querySelectorAll('button')[1];
   const container = document.querySelector('#ListOfCyphers');
   const title = container.previousElementSibling;

   const CypherMethods = [
        {
            name: "Binary Cipher",
            action: (text) => {
                if (!text) return "Invalid";  // Handle empty input
                return text.split('').map(char => char.charCodeAt(0).toString(2)).join(' ');
            },
            category: "Cipher",
            family: "Binary",
            description: "Converts text into binary representation.",
            ciphID: "Bin_20F5sdfdgfGFGyrt"
        },
        {
            name: "Binary Decipher",
            action: (binary) => {
                if (!binary || !/^[01\s]+$/.test(binary)) return "Invalid";  // Ensure only 0s, 1s, and spaces
                return binary.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
            },
            category: "Decipher",
            family: "Binary",
            description: "Converts binary back to readable text.",
            ciphID: "BinDecpH11_uytKLOP"
        },         
        {
            name: "Shifter Cipher",
            action: (text, shift = 1) => {
                if (!text || !/[a-zA-Z]/.test(text)) return "Invalid";
                return text.split('').map(char => 
                    String.fromCharCode(char.charCodeAt(0) + shift)
                ).join('');
            },
            category: "Cipher",
            family: "Shifter",
            description: "Shifts each letter forward in the alphabet.",
            ciphID: "Shft_CipH93skdjsA"
        },
        {
            name: "Shifter Decipher",
            action: (text, shift = 1) => {
                if (!text || !/[a-zA-Z]/.test(text)) return "Invalid";
                return text.split('').map(char => 
                    String.fromCharCode(char.charCodeAt(0) - shift)
                ).join('');
            },
            category: "Decipher",
            family: "Shifter",
            description: "Shifts each letter backward in the alphabet.",
            ciphID: "Shft_DecH03lmndB"
        },
        {
            name: "Reverse Words",
            action: (text) => {
                return text.split(' ').map(word => word.split('').reverse().join('')).join(' ');
            },
            category: "Cipher",
            family: "Reversal",
            description: "Reverses each word in the text.",
            ciphID: "Rev_WdsH56ptquX"
        },
        {
            name: "Reverse Words Decipher",
            action: (text) => {
                return CypherMethods.find(method => method.name === "Reverse Words").action(text);
            },
            category: "Decipher",
            family: "Reversal",
            description: "Restores reversed words back to normal.",
            ciphID: "Rev_WdsDecH67oprY"
        },
        {
            name:"vowel Swapper",
            action: (text) => {
                const vowels = "aeiou";
                return text.split('').map(char => 
                    vowels.includes(char) ? vowels[(vowels.indexOf(char) + 1) % vowels.length] : char
                ).join('');
            },
            
            category : "Cipher",
            family: "Vowels",
            description: "Replaces vowels with the next vowel in sequence.",
            ciphID: "VwlSwpH89zxvyM"
        },
        {
            name: "Vowel Unswapper",
            action: (text) => {
                const vowels = "aeiou";
                return text.split('').map(char => 
                    vowels.includes(char) ? vowels[(vowels.indexOf(char) - 1 + vowels.length) % vowels.length] : char
                ).join('');
            },
            category: "Decipher",
            family: "Vowels",
            description: "Restores swapped vowels to their original form.",
            ciphID: "VwlUnswpH12abcdN"
        },
        {
            name: "Caesar Cipher",
            action: (text, shift = 3) => {
                if (!text || !/[a-zA-Z]/.test(text)) return "Invalid";
                return text.split('').map(char => {
                    let code = char.charCodeAt(0);
                    if (char >= 'a' && char <= 'z') {
                        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
                    } else if (char >= 'A' && char <= 'Z') {
                        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
                    }
                    return char;
                }).join('');
            },
            category: "Cipher",
            family: "Caesar",
            description: "Applies a Caesar shift to letters.",
            ciphID: "Csar_CipH23lmnpQ"
        },
        {
            name: "Caesar Decipher",
            action: (text, shift = 3) => {
                if (!text || !/[a-zA-Z]/.test(text)) return "Invalid";
                return text.split('').map(char => {
                    let code = char.charCodeAt(0);
                    if (char >= 'a' && char <= 'z') {
                        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
                    } else if (char >= 'A' && char <= 'Z') {
                        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
                    }
                    return char;
                }).join('');
            },
            category: "Decipher",
            family: "Caesar",
            description: "Deciphers a Caesar shift back to the original text.",
            ciphID: "Csar_DecH34mnopR"
        },
        {
            name: "Base64 Encode",
            action: (text) => {
                if (!text) return "Invalid";
                return btoa(text);  
            },
            category: "Cipher",
            family: "Base64",
            description: "Encodes text into Base64 format.",
            ciphID: "B64_EncH45qrstU"
        },
        {
            name: "Base64 Decode",
            action: (text) => {
                if (!text) return "Invalid";
                try {
                    return atob(text);  
                } catch (e) {
                    return "Invalid"; 
                }
            },
            category: "Decipher",
            family: "Base64",
            description: "Decodes Base64 back into readable text.",
            ciphID: "B64_DecH56tuvwV"
        },
        {
            name: "Letter to Number Cipher",
            description: "Converts letters to their position in the alphabet (A=1, B=2, ... Z=26).",
            action: (text) => {
                if (!text || !/[a-zA-Z]/.test(text)) return "Invalid";
                return text.toUpperCase().split('').map(char => char.charCodeAt(0) - 64).join('');
            },
            category: "Cipher",
            family: "Math",
            ciphID: "LTNC919s9m16l5"
        },
        {
            name: "Letter to Number Decipher",
            description: "Converts numbers back into their corresponding letters.",
            action: (text) => {
                if (!text || !/^[1-9][0-9]*$/.test(text)) return "Invalid";
                return text.match(/\d{1,2}/g).map(num => String.fromCharCode(parseInt(num) + 64)).join('');
            },
            category: "Decipher",
            family: "Math",
            ciphID: "LTND919s9m16l5"
        },
        {
            name: "ROT13 Cipher",
            action: (text) => {
                if (!text || !/[a-zA-Z]/.test(text)) return "Invalid";
                return text.replace(/[a-zA-Z]/g, char => {
                    let base = char <= 'Z' ? 65 : 97;
                    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
                });
            },
            category: "Cipher",
            family: "ROT13",
            description: "Shifts letters forward by 13 places in the alphabet.",
            ciphID: "ROT_v19cVws7gh"
        },
        {
            name: "ROT13 Decipher",
            action: (text) => {
                return CypherMethods.find(method => method.name === "ROT13 Cipher").action(text);
            },
            category: "Decipher",
            family: "ROT13",
            description: "Deciphers text encrypted with the ROT13 Cipher.",
            ciphID: "ROTD-204gdrftYUIsfe"
        },
        {
            name: "Atbash Cipher",
            action: (text) => {
                if (!text || !/[a-zA-Z]/.test(text)) return "Invalid";
                return text.split('').map(char => {
                    let code = char.charCodeAt(0);
                    if (char >= 'A' && char <= 'Z') {
                        return String.fromCharCode(155 - code);
                    } else if (char >= 'a' && char <= 'z') {
                        return String.fromCharCode(219 - code);
                    }
                    return char;
                }).join('');
            },
            category: "Cipher",
            family: "Atbash",
            description: "Reverses the alphabet (A ↔ Z, B ↔ Y, etc.).",
            ciphID: "AT0B_QFxxmpsui"
        },
        {
            name: "Atbash Decipher",
            action: (text) => {
                return CypherMethods.find(method => method.name === "Atbash Cipher").action(text);
            },
            category: "Decipher",
            family: "Atbash",
            description: "Deciphers text encrypted with the Atbash Cipher.",
            ciphID: "ATOBD_wert4yCdf&6"
        },

    ];

    
    const params = new URLSearchParams(window.location.search);
    let cipheredTextFromUrl = params.get("ciph");
    let cipherID = params.get("id");

    if (cipheredTextFromUrl) {
        try {
            cipheredTextFromUrl = decodeURIComponent(cipheredTextFromUrl);
        } catch (e) {
            console.error("Error decoding cipher text:", e);
        }
    }
    
    if (cipherID) {
        try {
            cipherID = decodeURIComponent(cipherID);
        } catch (e) {
            console.error("Error decoding cipher ID:", e);
        }
    }

    if (cipheredTextFromUrl && cipherID) {
        // Find the correct cipher method using ciphID
        const method = CypherMethods.find(c => c.ciphID === cipherID);
        
        if (method) {
            // find the correspoding family
            const familyMethods = CypherMethods.filter(c => c.family === method.family);
        
            // Find the exact method by both family and ID
            const methodWithSameFamily =  familyMethods.find(c => c.family === method.family && c.ciphID !== cipherID);
           
            // convert text with coresponing family
            if(methodWithSameFamily){
                const decipheredText = methodWithSameFamily.action(cipheredTextFromUrl);
                const familiar = methodWithSameFamily.family;
                // Store last used family in sessionStorage
                sessionStorage.setItem("lastUsedFamily", familiar);
                
                currentCypher = { name: methodWithSameFamily.name, ciphtext:  decipheredText, originalText:cipheredTextFromUrl, family:familiar, idTag: methodWithSameFamily.ciphID}
                displayCyphers(currentCypher);
            }
            
            
        } else {
            console.error("Cipher method not found for ID:", cipherID);
            textAreaInput.value = "Invalid Cipher Method";
            upadateBtns();
        }
    } else {
            navigator.clipboard.readText().then((clipboardText) => {
            textAreaInput.value = clipboardText.trim() || (currentUserInput?.val ?? "Hello how are you today?");
            upadateBtns();
            }).catch((err) => {
                console.error("Failed to read clipboard: ", err);
                textAreaInput.value = currentUserInput?.val ?? "Hello how are you today?";
                upadateBtns();
            });
        
           
    }
    

    title.textContent = (container.children.length === 0) ? "Cyphers Loading..." : "Ciphers for you";

    textAreaInput.oninput = () => {
      upadateBtns();
    }

    function upadateBtns() {
        textAreaInputBtn1.disabled = textAreaInput.value.trim() === '';
        textAreaInputBtn2.disabled = textAreaInput.value.trim() === '';
    }

    textAreaInput.onfocus = function () {
        if(textAreaInput.value.trim() !== ""){
            textAreaInput.select();
        }
    }

    textAreaInputBtn1.onclick = function () {
        textAreaInputBtn1.disabled = true;
        textAreaInputBtn2.disabled = true;
        currentUserInput = {
            val: textAreaInput.value.trim(),
            cipher: true,
            id: null,
        };
        sessionStorage.setItem("currentUserInput", JSON.stringify(currentUserInput)); // Fix: Use JSON.stringify()

        renderCipher(currentUserInput);
        textAreaInput.value = '';
    }

    textAreaInputBtn2.onclick = function () {
        textAreaInputBtn1.disabled = true;
        textAreaInputBtn2.disabled = true;
        currentUserInput = {
            val: textAreaInput.value.trim(),
            cipher: false,
            id: null,
        };
        sessionStorage.setItem("currentUserInput", JSON.stringify(currentUserInput)); // Fix: Use JSON.stringify()

        renderCipher(currentUserInput);
        textAreaInput.value = '';
    }

    function renderCipher(currentUserInput) {
        if (!CypherMethods?.length) {  // Prevent errors if CypherMethods is undefined
            alert("We can't give that at the moment");
            return;
        }

        const overlay = document.querySelector('.category-overlay');
        const container = overlay.querySelector('ul');
        const title = overlay.querySelector(' h2 span');

        container.innerHTML = '';
        const category = currentUserInput.cipher ?  "Cipher" : "Decipher";

        title.textContent = category + ` (${currentUserInput.val?.slice(0, 6)}...)`;


        document.querySelector("#ListOfCyphers").innerHTML  = '';

        CypherMethods
            .filter(cym => cym.category === category)  // Choose correct category
            .forEach(cym => {
               const newLi = document.createElement('li');
               newLi.innerHTML = `<h2>${cym.name}</h2><p>${cym.description}</p>`;

               container.appendChild(newLi);

                newLi.onclick = function (e) {
                    e.stopPropagation();
                    const familiar = cym.family;
                    // Store last used family in sessionStorage
                    sessionStorage.setItem("lastUsedFamily", familiar);
                    currentUserInput.id = cym.ciphID;
                    
                   
                        // Find the correct cipher method using ciphID
                        const method = CypherMethods.find(c => c.ciphID ===  currentUserInput.id);
                        
                        if (method) {
                            // find the correspoding family
                            
                            const familyMethods = CypherMethods.filter(c => c.family === method.family);
                            
                            // Find the exact method by both family and ID
                            const methodWithSameFamily =  familyMethods.find(c => c.family === method.family && c.ciphID === currentUserInput.id);
                           
                            // convert text with coresponing family
                            if(methodWithSameFamily){
                                console.log("MethodWithSameFamily is okay");
                                const decipheredText = methodWithSameFamily.action(currentUserInput.val);
                                const familiar = methodWithSameFamily.family;
                                // Store last used family in sessionStorage
                                sessionStorage.setItem("lastUsedFamily", familiar);
                                currentCypher = { name: methodWithSameFamily.name, ciphtext:decipheredText, originalText: currentUserInput.val, family:familiar, idTag: methodWithSameFamily.ciphID}
                                displayCyphers(currentCypher);
                            }
                            
                            
                        } else {
                            console.error("Cipher method not found for ID:",  currentUserInput.id);
                            textAreaInput.value = "Invalid Cipher Method";
                            upadateBtns();
                        }
                    
                    
                    overlay.classList.remove('active');
               }
                
            });
        overlay.classList.add('active');

        overlay.onclick = () => {
            overlay.classList.remove('active');
            title.textContent = (container.children.length === 0) ? "Cyphers Loading..." : "Ciphers for you";

        }
    }

     
    function displayCyphers(cipher) {
        const container = document.querySelector("#ListOfCyphers");
        const title = container.previousElementSibling;

        if (cipher.ciphtext === "Invalid" || '' || cipher.originalText === "") {
            title.textContent = container.children.length === 0 ? "Cyphers Loading..." : "Ciphers for you";
            return;
        };  
    
        
        container.innerHTML = '';

        const newLi = document.createElement("li");
    
        newLi.innerHTML = `
            <div class="cipher-text">
                <p>${cipher.name}</p>
                <span></span>
            </div>
            <div class="cipher-buttons">
                <button>Share Text</button> 
                <button>Delete</button>  
            </div>`;
    
        newLi.querySelector(".cipher-text span").textContent = cipher.ciphtext; // Avoid innerHTML risk
        container.appendChild(newLi);

        title.textContent = container.children.length === 0 ? "Cyphers Loading..." : "Ciphers for you";

        newLi.onclick = function (){
            showText(cipher,cipher.ciphtext);
        }

        newLi.querySelectorAll('.cipher-buttons button')[0].onclick = function (e) {
            e.stopPropagation();
            shareText(cipher);
        }

        newLi.querySelectorAll('.cipher-buttons button')[1].onclick = function (e) {
            e.stopPropagation();
            deleteText(newLi);
        }
    }


    // Share text functionality (if supported)
    async function shareText(cipher) {
        const textToShare = cipher.ciphtext;
        const cipherID = cipher.idTag;  // Store ciphID
        const url = `${window.location.origin}${window.location.pathname}?ciph=${encodeURIComponent(textToShare)}&id=${encodeURIComponent(cipherID)}`;

         // Set dynamic meta tags
        const metaTitle = document.createElement("meta");
        metaTitle.setAttribute("property", "og:title");
        metaTitle.setAttribute("content", "Ciphered Message");

        const metaDescription = document.createElement("meta");
        metaDescription.setAttribute("property", "og:description");
        metaDescription.setAttribute("content", `🔐 ${textToShare} 🔓\nDo you want more ciphered text?`);

        const metaURL = document.createElement("meta");
        metaURL.setAttribute("property", "og:url");
        metaURL.setAttribute("content", textToShare);

        document.head.appendChild(metaTitle);
        document.head.appendChild(metaDescription);
        document.head.appendChild(metaURL);

        navigator.clipboard.writeText(url).then(() => {
            alert("Link copied to clipboard. You can now share it!");
        });
    }

    function deleteText(newLi) {
        newLi.remove();
        title.textContent = container.children.length === 0 ? "Cyphers Loading..." : "Ciphers for you";
    }
    

    function showText(cipher, text) {
        const overlay = document.querySelector('.overlay-text-preview');
        const originalTextField = overlay.querySelector('.orignal-text');
        const cipherTextField = overlay.querySelector('.ciphered-text')
        const  ciphBtn = overlay.querySelectorAll('.text-buttons button')[0];
        const textBtnb =  overlay.querySelectorAll('.text-buttons button')[1];
        const exitOverlay =  overlay.querySelectorAll('.text-buttons button')[2];

        originalTextField.innerHTML = '';
        cipherTextField.innerHTML = '';

        originalTextField.innerHTML = cipher.originalText;
        cipherTextField.innerHTML = cipher.cipherText ?? text;
        overlay.classList.add('active');

        exitOverlay.onclick = function() {
            overlay.classList.remove('active');
        }

        ciphBtn.onclick = function () {
            overlay.classList.remove('active');
            shareText(cipher);
        }

       textBtnb.onclick = function () {
            navigator.clipboard.writeText(cipher.originalText).then(() => {
                alert("Original text copied to clipboard.!");
            });
            overlay.classList.remove('active');

        }
    }


});


