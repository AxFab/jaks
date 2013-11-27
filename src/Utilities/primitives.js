
// ===========================================================================

String.prototype.trim=function()
{
  return this.replace(/^\s+|\s+$/g, '');
}

String.prototype.ltrim=function()
{
  return this.replace(/^\s+/,'');
}

String.prototype.rtrim=function()
{
  return this.replace(/\s+$/,'');
}

String.prototype.fulltrim=function()
{
  return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
}

String.prototype.startwith=function(str)
{ 
  return this.substring(0, str.length) == str;
}

String.prototype.endswith=function(str)
{
  return this.substring(this.length - str.length, this.length) == str;
}

// ===========================================================================
Array.prototype.contains = function (item) 
{
  for (var i=0; i<this.length; ++i)
    if (this[i] == item)
      return true;
  return false;
};


// ===========================================================================
Date.prototype.format = function (mask, utc) 
{
  return Utilities.dateFormat(this, mask, utc);
};

