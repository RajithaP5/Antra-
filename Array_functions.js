// filter
Array.prototype.myFilter = function (callBack, current) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
      let meets_condition = callBack.call(current, this[i], i, this);
      if (meets_condition) {
        result.push(this[i]);
      }
    }
    return result;
  };
  
  let nums = [1, 2, 4, 5, 6, 78, 96];
  
  console.log("All even --");
  console.log(
    nums.myFilter((a) => {
      return a % 2 == 0;
    })
  );
  
  // map
  Array.prototype.myMap = function (cb, current) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
      let output = cb.call(current, this[i], i, this);
      result.push(output);
    }
    return result;
  };
  
  console.log("Squares --");
  console.log(
    nums.myMap((a) => {
      return a ** 2;
    })
  );
  
  // includes
  Array.prototype.myIncludes = function (element, start = 0) {
    for (let i = start; i < this.length; i++) {
      if (this[i] === element) {
        return true;
      }
    }
    return false;
  };
  
  console.log(nums.myIncludes(4));
  console.log(nums.myIncludes(4, 3));
  
  // indexOf
  Array.prototype.myIndexOf = function (element, start = 0) {
    for (let i = start; i < this.length; i++) {
      if (this[i] === element) {
        return i;
      }
    }
    return -1;
  };
  
  console.log(nums.myIndexOf(4));
  console.log(nums.myIndexOf(10, -1));
  
  // reduce
  Array.prototype.myReduce = function (cb, init_val) {
    for (let i = 0; i < this.length; i++) {
      if (init_val == undefined) {
        init_val = this[0];
        continue;
      }
      init_val = cb(init_val, this[i], i, this);
    }
    return init_val;
  };
  
  let reduced1 = nums.myReduce((total, curr) => {
    return total + curr;
  });
  console.log(reduced1);
  
  let reduced2 = nums.myReduce((total, curr) => {
    return total + curr;
  }, 100);
  console.log(reduced2);
  
  Array.prototype.mySlice = function (start = 0, end = this.length) {
    let sliced = [];
    start = start < 0 ? this.length + start : start;
    end = end < 0 ? this.length + end : end;
    for (let i = start; i < end; i++) {
      sliced.push(this[i]);
    }
    return sliced;
  };
  
  console.log(nums.mySlice(0, 3));
  console.log(nums.mySlice(3, 5));
  console.log(nums.mySlice(-3, -1));
  
  
  
  // splice
  Array.prototype.mySplice = function (index, count, ...items) {
    let deleted = [];
    if (index < 0) {
      index += this.length;
    }
    let l = index;
    if (count > 0) {
      let limit = index + count;
      while (l < this.length) {
        if (l < limit) {
          deleted.push(this[l]);
        }
        if (l + count < this.length) {
          this[l] = this[l + count];
        } else {
          delete this[l];
        }
        l += 1;
      }
      this.length -= count;
    }
  
    if (items) {
      let end = this.length - 1;
      this.length += items.length;
      for (let i = end; i >= index; i--) {
        this[i + items.length] = this[i];
      }
      for (let i = 0; i < items.length; i++) {
        this[index + i] = items[i];
      }
    }
    return deleted;
  };
  
  
  
  console.log(nums.mySplice(1,2))