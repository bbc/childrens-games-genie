const imgUrlOnePixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
const lightGreySquare100 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAADsSURBVHhe7dKhEcAwEASxlP7zlZukAC8zkNDhnfuGa2IFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgViBWIFYgVvxdrdfz3JswKxArECsQKxArECsQKxArECsQKxArECsQKxArECsQKxArECsQKxArECsQKxArECsQKxArECsQKxArECsQKxArECsQKxArECsQKxArECsQKxArGuzRxzjZtt+taLMgAAAABJRU5ErkJggg==";
const darkGreySquare100 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAADWSURBVHhe7dAxAQAwEAOhSot/VbXwt4ME3jiTFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZJ1tH16JTbQV0LNYAAAAAElFTkSuQmCC";
const redRing200 =
    "data:image/png;base64,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";
const greenCircle40 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC41ZYUyZQAAAtJJREFUWEfNWb9rFEEYfUaFKGqnEIgJmELUIr2WFrYiIZUEkkYkpYViE8TC3kYLUwQxghiF/AmihRH8bZPgH6CnEAMRztx853s3c8sQ4rmX29ud793bmZ3b/ebd7M737c6ha2viIAxj2MIFlnNwWCZXyQ3uC474QX4gl7h/nTxLHue5g8FLH8xwDA1cZqcPWV8jt9hhPhg2ybfkA551iS2HgtcCrIl95EU6f0n+bHW4W1iL3/gjH7M8zb09oZcezHCNjtZZyn0xMF4LR6ENTIVeurQmBsgTdPQouOwfHO6yn6Os5RxNiTOcJ9+QLrjpHwx1UgMxEhT8x/zIlSOuDYl0eMpajsmjX1OmuDb8fXk/qNjBNFv9hKgWhhluB4KqyBRKNFvjg6uAY4ytYzyoCqYg7ONccaFkt1ACMNxiLco6yhC9BuEiYUyTmqwtU25V+ooPqBo+40xxu1eXd4xcC1+lA8ML8gDCU0n+xF8WfAA/qRGci5rTguEqeP8tR01pwbAogatRU1owfJLAjagpLTgmDqqsPjj/C9LGT/kPBnkhbfykk0G2w6EmgR+jprTgsCKBz6KmtOCwoFx8I2tIDYZpTZJzVPo7ak4DCjGGYY3gCCvvsi9SgWGJWz4TamOYJ+Ovq4Xin2GStfDob5jgkNayA6qG4TU56sXJDIcp8AnL6oO25oNhlrX9QV0wwxnye3ZgVXB4Tx1DQVVkWnrQtI4PrgK63TougzjcI/9kJ5QFv0R3J6joYP4VVMtj9ej0fmOdb5Y3WeZY4NTw+tj4nCxj8WizJU4TtSszHCHnI1f9gS5rT0vDhiscx68sG5nTXqFQ4mfrROilB9PLs2GcvE2nn1nGXXUHnyEUhGfJIbYUsATcNr1E6yW/gRkKfcV6/knkE79W/CfJUbZsC8JFmh9RiT1FaiQWKeAL+Yt1QX9D1MgVcoH70+Qwzxskd1hW62TAX/UEJP2Z2GhOAAAAAElFTkSuQmCC";
const ship =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOcAAABSCAYAAACv88PmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH3wsGCxkjSDVdHAAABCdJREFUeNrt3U1PE0Ecx/FfGx9Auk1pbQxKEHFrjAcvKiktiTEapSY8Wb1w8EX4Cnw13pAoB04afQ0mnIwHj0KBGBqjl/XAk22X2sK2O7P7/SQTA3jY7syv/5nZ3VYCAAAAACBCrg9zDoATuX11oN2fvYBbg+L1FB0ASEocEz5Tjw2IjaTBx+ZJUrmQppeA0sRQv6ayXU99yy7TXeAorAWn4efJa06YYQVwnElXmnazYVZUlVymuYiHIDZdPAuPGTDeqTaE9jdr+h0Wr3yD6gn813QhE8YUV1PXHE4+0M6difDWnwBrTjPXnqw/wZrTZFPjXP8E4fR19+qFMI/fO586Sy8CHUxrQ7k54cHNbGRPaqr4mJGF7j1Jp8MOpu/m0OLwsCnHFfim17l70ww8HHmRTptUKTsdzF7E26ErlRnJnWGgMm2lmR7Y0utXjFbCSTM5pJceLDBqo27OcaTe3jBAoHoc1Ey5wkC2TLcX8VuClpYSP3tbrRFQX+fvP9XGRl1a/8zZiJJHTf/20/zICJXWkt1kxG23+PMZQhnzoC+m4/ckkk33pvJOzfKrxWwqpdXd3Ui+6CTBhCX979tWd3cbfi63q76ZDJWTcMKWsf5waEgf6nUqJ8GEadX3Q73edt27EGK1TRBOwMy8JAgmYGZ+kpxfINipcvN/qhBOwMjQam3/l9VcjmktYMN0eDGX00qtRjgB24LKtBYwYAq8UqupevFiMOF81uX8uVsvvwzaUNmBwEK6vLl5qnAeLnLftpkrB2Hn2y+6C7F20srZ88eI3s9Lzz+doYcQm7VnNZ9vXYx2GUoAAQczyMoJIKiKefRRrqcKZ0Js0gCBhPJZLpeQpOXt7dOHs5rNElIgiGqZy/V8U1UL/iWZj92g0Xw2She6uAQZRvVjUwmx3+zpRN82hG61rlv9GhClUCbmsyf/kq2+hXP9P38vF9IioIhCIA82eiTp3daW3a9oP5isVWn2rymb7o+1OJQOoaRZHcZe3mMe6jQyozHt6DsbRIj0xo7xa04/BBM2rCElJZbGxqL/bnBChBh9y8JSPq83GxuhH5DR99buf0cKwUTgZgcGjr2MZ0IwbaicBBOBju9KKqU1S75bhXAiMsGTpMrgoNZ+ReNBfSOmtSXX8QslwYTU5m6yWadl3EQmmKZUTkIYbL94jLFoSBJMu13uvNKE1SRJcz5VDlRO+gUMAoJKOBGdae2h0t59tjw6BljyDu3RL6ByAiCcnah+TFJBwLQ2TMVRKTng6Mf2H32t/WZ6y7QWhg0CdmkJJ0yb1hZH6YRm45wCGPYOTfWkcsKkyik1XOME5wEGDwSPPgEMu5RSnBg6GJwMUMBEpb2Q/ltJY9Ncl/6H4cqND2DH6rNQAXuCWohFUJvfkAALp71uKlKvZ4pQAgAAAAAAAPgLkzH/LC/qgyYAAAAASUVORK5CYII=";

export const assets = {
    imgUrlOnePixel,
    lightGreySquare100,
    darkGreySquare100,
    redRing200,
    greenCircle40,
    ship,
};

export function objectToJsonDataUrl(object) {
    return "data:application/json;base64," + btoa(JSON.stringify(object));
}
