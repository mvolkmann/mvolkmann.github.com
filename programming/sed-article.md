# That's What I sed

## Overview

`sed` is a Unix text processing utility.
The name is short for "stream editor".
Like other filters in the Unix paradigm,
the input to `sed` is a stream of text and
the output is an edited version of that text.

`sed` has been branded a "power tool" and "Swiss Army Knife".
While most developers don't need a stream editor on a daily basis,
`sed` is a great tool for your automated text manipulation toolbox.

Memorizing all the capabilities and syntax details
of `sed` can be a daunting task.
But after reading this article you will know enough
to recognize when using `sed` is appropriate
and will be familiar with the features of `sed`
that are used most often in practice.
When necessary, you can return to this article for
a refresher on the more advanced features of `sed`.

`sed` is based on the `ed` editor
which was created by Ken Thompson in 1969.
`sed` was created Lee McMahon of Bell Labs in 1973.
Currently the most popular version is GNU sed.
This is available on all major operating systems
including Linux, macOS, and Windows.

Alternatives to `sed` include the Unix utility `awk`
and nearly any general purpose programming language.

`awk` excels at processing record-based text
where each line is thought of as a record
composed of columns with similar formatting,
perhaps separated by spaces or tabs.

General purpose programming languages have the advantage
that they can perform any kind of text transformation.
But the code required is longer than when using `sed`.

`sed` can perform text transformations in very
compact way, but the code is harder to read.
Also, there are some kinds of text transformations
that are not possible in `sed`.
However, it is worthwhile learning `sed` for the cases
that it handles well because those cases occur quite often.

`sed` can be used on its own, but it is often used
in combination with other Unix utilities such as
`cat`, `expr`, `head`, `seq`, `sort`, `tail`, `tr`, and `uniq`.

`sed` makes heavy use of regular expressions.
Having an understanding of them is essential for using `sed` effectively.

## sed Use Cases

Typically `sed` is used to operate on text files
where lines are terminated by a newline character.
`sed` can also operate on binary files, but doing so is not common.

A common use for `sed` is automating the application of the
same kinds of modifications to a large number of input files.
The files may already exist or perhaps they are
created over time and need to modified after each is created.

Another use is making many modifications to a single large file.

`sed` is less helpful when a small number of changes
are needed in a single small file.
In this case using a text editor is usually sufficient.
This is especially true for editors like Vim and Emacs
that support macros.

## Installing sed

Most versions of Unix ship with GNU `sed`.

macOS includes a version of `sed`, but it is not
GNU `sed` and differs from it in some ways.

To install GNU `sed`, first install Homebrew
and then enter `brew install gnu-sed`.

Use the command `gsed` to invoke GNU `sed` instead of the default `sed`.
All the examples in this article show use the `sed` command.
change this to `gsed` if you are using macOS!
Better yet, consider aliasing `sed` to `gsed` so GNU `sed` is always used.

Windows does not include a version of `sed`.
A good option for installing it is
<http://gnuwin32.sourceforge.net/packages/sed.htm>.
See the link "General Installation Instructions".
Another option for Windows is to install "UnxUtils"
from <http://sourceforge.net/projects/unxutils/>.

## sed Command Line Options

The following table summarizes the most commonly used
`sed` command line options.

| Option                        | Description                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| -e or --expression {script}   | value is a `sed` script to run                                                                     |
| -f or --file {script-file}    | value is a path to file containing a `sed` script                                                  |
| -h or --help                  | summarizes command line options (enter `man sed` for more)                                         |
| -i or --in-place              | edits input file rather than writing to stdout and can create a backup file with a given extension |
| -n or --quiet or --silent     | turns off AutoPrint (described later)                                                              |
| -E or -r or --regexp-extended | enables extended regular expressions (fewer backslashes)                                           |
| -s or --separate              | treats multiple input files as separate streams                                                    |
| --version                     | outputs `sed` version, copyright, license, authors, and more                                       |

The `-f` option can be used multiple times
to read from multiple `sed` script files.

Less frequently used options include `-b` or `--binary`,
`--follow-symlinks`, `-l` or `--line-length`,
`--posix`, and `-u` or `--unbuffered`.

## Getting Input

The text to be transformed can be provided to `sed` in a file.
A "script" of `sed` commands can also be provided in a file.
Assuming a suitable shell, the following are
equivalent ways to supply these files to `sed`:

- `sed -f my-script.sed my-input.txt`.
- `cat my-input.txt | sed -f my-script.sed`.
- `sed -f my-script.sed < my-input.txt`.

Text can also be provided from the output of another command.
For example:

```script
cmd1 | sed -f my-script.sed
```

The output of `sed` can be used as the input to another command.
For example:

```script
cmd1 | sed -f my-script.sed | cmd2
```

Any number of input files can be listed at the end of a `sed` command.
They are treated as one concatenated input file.
As we will see later, `sed` can target
the first and last input lines in transformations.
By default, only the first line of the first file is treated as line #1
and only the last line of the last file is treated as the last line.

## Directing Output

By default `sed` sends its output to standard output (stdout).

The output can be redirected to a file.
For example:

```script
sed -f my-script.sed my-input.txt > my-output.txt
```

Alternatively the input file can be modified in place using the `-i` flag.
For example:

```script
sed -i -f my-script.sed my-input.txt
```

This stores intermediate results in a temporary file and
replaces the input file with this at the end of processing.

It is a good idea to make a backup copy of files
before modifying them in place so the changes
can be reverted if they aren't what is expected.
This can be done by specifying a backup file extension
as an argument to the `-i` option.
For example `sed -i.bak my-script.sed my-input.txt`
creates the file `my-input.txt.bak`.

Another good practice is to run the command without `-i` first
and examine the output sent to stdout
before running the command with `-i`.

## Regular Expression Review

Readers that are already familiar with regular expressions
should skip to the "Two sed Buffers" section.

Regular expressions specify a pattern used to match text.
They are typically written with the syntax `/{pattern}/{flags}`.

The simplest pattern just specifies literal text to match.
For example, `/abc/` matches any text that
contains the consecutive letters "abc".

### Special Characters and `sed`

In the sections ahead we will see that some characters
have special meaning in regular expressions.
These include `+`, `?`, `|`, `{`, `}`, `(`, and `)`.

By default when these characters are used in `sed` regular expressions
they are treated as literal characters.
In order to have their special meaning they must be escaped with a backslash.
Remembering which characters need to be escaped is difficult
and escaping them makes regular expressions even more complicated.

This can be avoided by using the `sed` flag `-E` (or `-r`)
for extended regular expressions.
With this flag `sed` used "Extended Regular Expressions"
in which the special characters have their special meaning
without being escaped and
behave as literal characters when escaped.
I recommend always including this flag.

The following examples use extended regular expressions.

### Wildcards

A dot (`.`) matches any character.
For example, `/a.c/` matches any text that contains
an "a", followed by any character, followed by a "c".

To include a literal period in a regular expression,
escape it with a backslash (`\.`).

### Repetition

The number of times a character, wildcard, or group
is expected to appear in the text defaults to one.
These can be followed by a special syntax for other options.

- `{n}` means n times.
- `{n,}` means at least n times.
- `{m, n}` means at least m times and not more than n times.
- `?` means zero or one (optional) and is the same as `{0, 1}`.
- `*` means zero or more and is the same as `{0,}`.
- `+` means one or more and is the same as `{1,}`.

For example:

- `x?` matches an empty string or "x"
- `x*` matches an empty string, "x", "xx", "xxx", and so on
- `x+` matches "x", "xx", "xxx", and so on, but not an empty string
- `x{3}` matches "xxx", exactly three consecutive "x" characters
- `x{3, }` matches three or more consecutive "x" characters
- `x{, 3}` matches zero to three consecutive "x" characters
- `x{3, 5}` matches three to five consecutive "x" characters

To include a literal question mark, asterisk, or plus in a regular expression,
escape it with a backslash (`\?`, `\*`, and `\+`).

The `?`, `*`, and `+` repetition characters are greedy.
This means the entire regular expression will
match as many characters as possible.

### Character Classes

Character classes inside a pattern specify a set of characters
that are allowed at a given position in a pattern.
They are specified inside square brackets.
For example, `[pie]` means that one of "p", "i", or "e" is allowed.

Ranges of characters can be described using a dash.
For example, `[a-d]` matches the characters "a", "b", "c", and "d".
Multiple ranges can be specified in a single character class.
For example, `[0-9a-f]` matches any digit
or the lowercase letters "a" through "f".

To include a dash as an allowed character in a character class
it must be the first character listed.

Character classes are negated if the first character is a caret.
For example, `[^aeiou]` means not a vowel.
and `[^a-f]` means not a lowercase letter from "a" to "f".

Sometimes the best way to match characters between two delimiters
is to match the starting delimiter,
followed by characters that are not the ending delimiter,
followed by the ending delimiter.
For example, to match zero or more characters surrounded by parentheses,
use `\([^)]*\)`.
Note that the parentheses outside the character class
are escaped with a backslash, while
the one inside the character class is not escaped.

Suppose we want to match an underscore, followed by
any other characters, and another underscore.
An example is "_apple_banana_cherry_".
The regular expression `/_.+_/` will work.
Note that the `.*` part will not match the final underscore.
If it did then the match would fail to match because the
final underscore in the pattern wouldn't have anything to match.

Another approach we could try is `/_[^_]+_/`.
This looks for an underscore, followed by any characters
that are not underscores, followed by an underscore.
It matches "\_apple\_", but not "\_apple_banana_cherry\_".

Predefined character sets have a more compact syntax.
For example, `\w` is a "word character" and
has the same meaning as `[A-Za-z0-9_]`.
`\W` means not a word character.
Note that a hyphen or dash ("-") is not considered a word character.

Other tools that support regular expressions often recognize
additional predefined character sets such as `\d` for digits.
`sed` only supports `\w` and `\W`.

`sed` also supports "Posix character classes"
that have the format `[[:`_`name`_`:]]`.
The most useful of these are:

- `[[:lower:]]` which is equivalent to `[a-z]`
- `[[:upper:]]` which is equivalent to `[A-Z]`
- `[[:digit:]]` which is equivalent to `[0-9]`
- `[[:alpha:]]` which is equivalent to `[a-zA-Z]`
- `[[:alnum:]]` which is equivalent to `[a-zA-Z0-9]`
- `[[:blank:]]` which is equivalent to `[ \t]`

As you can see, using Posix character classes requires
typing more characters than typing equivalent character ranges.

To include literal square brackets in a regular expression,
escape them with a backslash (`\[` and `\]`).

### Grouping and Back References

Parts of a pattern enclosed in parentheses form a group.
Matching text is captured and can be used later via "back references"
in the pattern or in a replacement value.
A back reference is a backslash followed by a single digit.

The expression `/([0-9]{3}).+\1/` matches three digits,
followed by one or more other characters,
followed by the same three digits.
It would match "123mark123", but not "123mark456".

The back reference `\1` refers to the first group in the
regular expression, `\2` refers to the second, and so on.

The repetition characters `?`, `*`, and `+` can be applied to groups.

To include literal parentheses in a regular expression,
escape them with a backslash (`\(` and `\)`).

### Anchors

By default regular expressions match any text that contains a match.
For example, `/two/` matches "two", "one two", "two three", and "one two three".

To require the match to appear at the beginning of the text,
precede the pattern with `^`. For example, `/^two/`.

To require the match to appear at the end of the text,
follow the pattern with `$`. For example, `/two$/`.

To require the entire text to match the pattern,
use both `^` and `$`. For example, `/^two$/`.

To include a literal caret as the first character or
a literal dollar sign as the last character in a regular expression,
escape them with a backslash (`\^` and `\$`).
When `^` is not the first character in a regular expression
or `$` is not the last, they are interpreted literally
and do not need to be escaped.

These can be combined to find blank lines
by matching `/^$/`.

### Alternatives

The `|` character allows specifying more than one pattern to match.

For example, `/red|green|blue/` matches text containing
"red", "green", or "blue".
The patterns before and after the `|` can be any kind
of regular expression pattern, not just literal text.

The order of precedence in regular expressions is
grouping, concatenation, and alternation.

To include alternatives in the middle of a larger regular expression
they must be enclosed in parentheses.
For example, `/(home|work) address/`.

### Regular Expression Flags

Commonly used flags include:

- `g` for global matching, not just first match
- `i` for case-insensitive (ignore case) matching

### Regular Expression Examples

The following regular expression matches text that contains a U.S. zip code.

```script
/[0-9]{5}/
```

The following following regular expression matches text that contains
a phone number in the format `(999)999-9999`.
The parentheses are escaped with a backslash
so they are not interpreted as grouping.

```script
/\(\d{3}\)\d{3}-\d{4}/
```

Recall that `sed` does not support `\d`,
so `[0-9]` must be used in its place.

The following regular expression matches text that contains the
full name of a person where the middle name is optional.
It assumes that any part of the name
starts with an uppercase letter,
followed by zero or more lowercase letters,
and apostrophes.

```script
/[A-Z]['a-z]* ([A-Z]['a-z]*)? [A-Z]['a-z]*/
```

The following regular expression matches the first line of a
JavaScript function definition with common formatting.
For example, "`function area(width, height) {`".
It does not match "arrow functions".
The following parts must be matched in order:

- beginning of the line
- zero or more spaces and tabs
- the "function" keyword
- a space
- the name of the function (word characters)
- a left paren (escaped)
- an optional parameter list
  where parameter names are separated
  by a comma and a space
- a right paren (escaped)
- a space
- an open curly brace
- end of the line

The parameter list is made optionally by
enclosing it in parentheses to create a group
and placing a `?` after the group.

```script
/^[ \t]*function \w+\((\w+(, \w+)+)?\) \{$/
```

## Two `sed` Buffers

Text read by `sed` is temporarily stored in two buffers
referred to as the _pattern space_ and the _hold space_.

In normal operation `sed` reads each input line into the pattern space
one at a time and runs one or more `sed` commands on this text.
Most `sed` commands only operate on the pattern space.

Usage of the hold space will be discussed later.

## Substitute Command

Substitute (`s`) is the most commonly used `sed` command.
It specifies a regular expression that identifies text to match
and a substitution expression that specifies its replacement
(called "SubEx" in some documentation).

These expressions are typically delimited by slash characters ("/"),
but other delimiter characters such as `:`, `|`, and `_` can also be used.
If the delimiter occurs in a regular expression,
it must be escaped by preceding it with a backslash.

Here is an example that changes the first occurrence of "red" to "blue"
and the first number 1 to the word "one" in each input line.

```script
sed 's/red/blue/; s/1/one/' input.txt
```

Each substitute command uses three delimiters:
one at the beginning, one at the end,
and one separating the pattern from the replacement.

Note how multiple `sed` commands (`s` in this case) are separated by semicolons.
Semicolons can optionally be followed by a space for readability.

Another way to write this is to use the `-e` option multiple times.

```script
sed -e 's/red/blue/' -e 's/1/one/' input.txt
```

There are two potential issues with the regular expressions above.

The first issue is that they only replace the first match
in each input line.
To replace all matches, add the `g` (global) flag as shown below.

The second issue is that they match any text that contains a match,
but do not require matching complete words.
For example, `/red/` matches "red", "Fred", and "redder".
Sometimes this is what is desired.
When it is not we can fix it by using word boundary markers.
The beginning of a word is indicated with `\<` or `\b`.
The end of a word is indicated with `\>` or `\b`.
`\B` represents a position that is not a word boundary.

The following `sed` command addresses both issues.

```script
sed -s -i '/\bred\b/blue/g; s/\b1\b/one/g' input.txt
```

Here is a `sed` command that
removes all trailing spaces and tabs from a file.
It does this by replacing them with nothing.

```script
sed -E -i 's/[ \t]+$//' input.txt
```

### Substitution Metacharacters

The substitution expression can contain the following metacharacters:

| subex metacharacter        | Meaning                                               |
| -------------------------- | ----------------------------------------------------- |
| `&`                        | insert entire match                                   |
| `\l`                       | change next character to lowercase                    |
| `\u`                       | change next character to uppercase                    |
| `\L`                       | change remainder to lowercase up to next `\U` or `\E` |
| `\U`                       | change remainder to uppercase up to next `\L` or `\E` |
| `\E`                       | ends effect of `\L` or `\U`                           |
| back references (ex. `\1`) | insert match for a given group                        |

The Unix utility `seq` outputs a sequence of numbers up to a given number.
For example, `seq 3` outputs 1, 2, and 3 on separate lines.
This can be used to generate input for `sed`.

The following script outputs the lines
"score: 1", "score: 2", and "score: 3".

```script
seq 3 | sed -E 's/[0-9]+/score: &/'
```

The following script outputs "Mark VOLKMANN".

```script
echo "mark volkmann" | sed -E 's/(\w+) (\w+)/\u\1 \U\2/'
```

The following script outputs "Mark Volkmann".
It has the same output regardless of the case in the input text.

```script
echo "mARK vOLKMANN" | sed -E 's/(\w)(\w*) (\w)(\w*)/\u\1\L\2\E \u\3\L\4/'
```

### Substitute Command Flags

Here is a summary of the flags supported by the `s` command
that follow the last delimiter.

| `s` flag        | Description                                          |
| --------------- | ---------------------------------------------------- |
| a number        | changes a specific match (ex. 2 for only the second) |
| `g`             | substitutes globally (all occurrences)               |
| `i`             | ignores case                                         |
| `m`             | enables multiline mode                               |
| `e`             | executes replacement as a shell command if matched   |
| `p`             | prints replacement if matched                        |
| `w {file-path}` | writes replacement to the file if matched            |

Any number of these flags can be combined.
If the `w` flag is used, it must come last
because it is followed by a file path.

If a number is specified along with the `g` flag
then matching starts at that occurrence number.
For example, `s/foo/bar/3g` replaces all occurrences of
"foo" with "bar" starting with the third occurrence.

In multiline mode:

- `^` matches the start of each line.
- `$` matches the end of each line.
- `` ` `` matches the start of the first line.
- `'` matches the end of the last line.

This is useful in combination with the `N` command
which appends a newline and the next input line to the pattern space.

When not in multiline mode, `` ` `` is the same as `^`
and `'` is the same as `$`, but `^` and `$` are preferred.

The `e`, `p`, and `w` flags are typically used in combination
with the `sed` `-n` option which suppresses the default output.

The `e` flag can be used to process input that contains file paths
and form/execute shell commands that operate on those files.
There is an example like this later
in the "Less Common Commands" section
when the `e` command is discussed.

## sed Scripts

`sed` scripts are code that is provided to the `sed` command
that specifies the edits to be performed.
This is done with one or more strings and files,
but typically only one is used.

Multiple string scripts are provided using the `-e` option.
File scripts are provided using the `-f` option.
Any number of each can be specified.
Each of these options appends `sed` commands
to the list of commands to be evaluated
in the order in which they are specified.

For example:

```script
sed -e 's/red/blue/' -f script1.sed -e 's/one/two/g' -f script2.sed my-input.txt
```

Note how values for the `-e` option are enclosed in single quotes.
This is typically preferred.
Double quotes must be used if the script
contains references to environment variables.
Quotes can be omitted in some cases, but are needed
for scripts that contain spaces and other special characters.
It is recommended to always enclose the script in
single or double quotes to avoid confusion.

We can also create a file like "my-changes.sed" containing the following.
Each `sed` command must either be on a separate line
or separated from the previous command by a semicolon.

```script
s/\bred\b/blue/g
s/\b1\b/one/g
```

Pound signs (`#`) in script files mark the beginning
of a comment that extends to the end of the line.

This script file can be used as follows:

```script
sed -f my-changes.sed input.txt
```

## sed Commands

`sed` commands have single-letter names.
For example, `s` is the substitute command.

The default mode for executing `sed` scripts does the following:

```text
for each line of input
  read the line into the pattern space, replacing previous contents
  remove the newline at the end
  for each sed script specified
    for each command in the sed script
      if the command has no address or the address matches the line
        process the command
  add a newline at the end of the pattern space
  AutoPrint the contents of the pattern space
```

By default the contents of the pattern space are written to stdout
after each line of input is processed.
This is referred to as "AutoPrint".
The `sed` option `-n` disables this.

`sed` commands operate on the pattern space or the hold space
which are populated from the input stream.
They do not operate directly on the input stream.
This is good because the pattern space and the hold space can be modified
by `sed` commands before subsequent commands are executed.
This allows a kind of compound processing of input.

The syntax of each command is
_`address`_ _`command`_ _`options`_.
The _`address`_ portion is optional and is described in the next section.
A _`command`_ is required.
Valid options depend on the command
and some commands do not require any.

To run more than one command when the address is matched,
surround them in curly braces and separate them with semicolons.
This is referred to as "grouping".
We'll see an example like this in the
"the hold space Commands" section later.

## sed Addresses

A `sed` command can optionally be preceded by an "address"
that describes the input lines for which the command should be run.
When no address is specified, the command is run on all input lines.

Addresses are frequently used to identify the lines on which
substitutions will be made or the lines that will be deleted.

There are many kinds of supported addresses including:

- a line number  
  For example, `7` runs only on line 7.

- a range of line numbers (referred to as "L,H" for low to high)  
  For example, `8,12` runs only on lines 8 to 12 inclusive.
  The high line number can be `$` to make the range end at the last line.

- a regular expression to match  
  For example, `/ice cream/` runs only on lines that contain "ice cream".

- a pair of regular expressions that identify
  the first and last lines of ranges  
  For example, `/April/,/July/` runs on every range of lines
  that beginning with a line that contains "April"
  and end with a line that contains "July".

- a line number and a regular expression  
  For example, `7,/April/` runs only on the lines from
  line 7 to the next line that contains "April".
  If line 7 contains "April" the command is only run on that line.
  If no line starting with line 7 matches the `/April/`
  then the command is run on **all** remaining lines.

- a regular expression and a number preceded by "+"  
  For example, `/April/,+3` runs on every range of lines
  beginning with a line that contains "April"
  and continuing for three more lines
  for a total of four lines.

- a regular expression and a number preceded by "~"  
  For example, `/April/,~4` runs every line that contains "April"
  plus every line that is a multiple of four after that line.
  This is rarely used.

- a line number and a step count separated by "~"  
  For example, `5~3` runs on line 5 and every line that is
  a multiple of three lines after that (5, 8, 11, ...).

- `$`  
  This runs the command only on the last line.  
  For example, `seq 3 | sed -E '$ s/[0-9]+/found/'`
  outputs the lines "1", "2", and "found".

Adding an exclamation mark to the end of any address negates it.
For example:

- `7!` runs on every line except line 7.
- `/April/!` runs on every line that does not contain "April".
- `$!` runs on every line except the last.

When a regular expression is used as an address,
subsequent commands that use a regular expression
can omit it to default to the same regular expression.
For example:

```script
`/^[A-Z][0-9]{3}/ s//hide/`
```

This matches all lines that start with an uppercase letter
followed by three digits and replaces that
part of the line with the word "hide".

## sed Command Summary

### Common Commands

The following table summarizes the most commonly used
`sed` commands in alphabetical order.

| Command                   | Description                                      |
| ------------------------- | ------------------------------------------------ |
| a _text_                  | appends _text_ after normal output               |
| c _text_                  | changes normal output to _text_                  |
| d                         | deletes the pattern space (clears it)            |
| D                         | deletes only the first line in the pattern space |
| i _text_                  | inserts _text_ before normal output              |
| s/_regex_/_subex_/_flags_ | substitutes text with different text             |

Recall that _subex_ is short for "substitution expression".

The `d` command causes an input line to not be output,
deleting it.
For example, `/~$/ d` deletes all blank lines.

The `D` command is useful when multiple input lines
have been read into the pattern space.
One way to do this is with the `N` command described later.

The commands `a`, `c`, and `i` are related.
They all provided a way to output arbitrary text.
It can be output before (`a`), after (`i`),
or in place of (`c`) the normal output.

This arbitrary text is never placed in the pattern space,
so it cannot be edited by subsequent `sed` commands.

In the examples that follow for the `a`, `c`, and `i` commands
a regular expression address (`/foo/`) is used
to target lines that contains "foo".

The `a` command holds the specified text until the current script finishes
or the `n` or `N` command is used to read the next line of input.
For example, `/foo/ a bar baz` appends the line "bar baz"
after every line that contains "foo".
Note that the text to append is not surrounded by quotes.

The `i` command immediately outputs the specified text
and continues with the current script processing.
For example, `/foo/ i bar baz` inserts the line "bar baz"
before every line that contains "foo".

The `c` command deletes the pattern space, skips the remainder of the current script,
and outputs the specified text.
For example, `/foo/ c bar baz` changes every line that contains "foo"
to the line "bar baz".

Multiple lines of new text can provided in two ways.
The first is by separating them with `\n`.
The second is by separating them with a backslash and an actual newline character.

The following two `sed` commands change every line that contains "alpha"
to the lines "beta", "gamma", and "delta".
They are equivalent.

```script
/alpha/ c beta\ngamma\ndelta

/alpha/ c beta\
gamma\
delta
```

We explored the `s` command earlier.

### Less Common Commands

The following table summarizes less commonly used
`sed` commands in alphabetical order.

| Command  | Description                                                           |
| -------- | --------------------------------------------------------------------- |
| =        | prints current line number followed by a newline                      |
| e        | executes the pattern space as a shell command                         |
| p        | prints the pattern space (useful when AutoPrint is off)               |
| P        | prints only the first line (up to newline) in the pattern space       |
| r {file} | reads content of a file and prints it                                 |
| R {file} | reads and prints the next line of a file                              |
| w {file} | appends the pattern space to given file                               |
| W {file} | appends first line (up to newline) of the pattern space to given file |
| y        | replaces given characters with others (transliterates)                |

The `=` is mostly useful for debugging `sed` scripts.
We will see an example of this later
in the "Matches That Span Lines" section.

The `e` command expects the contents of the pattern space to be a shell command
and executes it. For example, suppose we have the
input file `file-paths.txt` where each line is a file path.
We can use `sed` to output the number of lines in each file,
followed by the file path by forming a Unix `wc` command
for each line and executing it.
Recall the that subex metacharacter `&` outputs
the entire match which in this case is a file path.

```shell
sed -E 's/.*/wc -l &/; e' file-paths.txt
```

This produces output like:

```text
       3 ./fruit.txt
       3 ./greek.txt
      25 ./story.txt
```

The same output can be produced by using the substitute command `e` flag
instead of the `sed` `e` command.

```shell
sed -E 's/.*/wc -l &/e' file-paths.txt
```

The `p` command outputs the current value of the pattern space.
It is especially useful in conjunction with the `-n` option
which disables AutoPrint. This allows multi-command `sed` scripts
to decide whether and how many times to output the pattern space.

The `P` command is similar, but only outputs the first line of the pattern space.
It is useful in `sed` scripts that
read more than one input line into the pattern space.

The `r` command causes all the lines in a given file
to be output at the end of a `sed` script.
For example, suppose the file `fruit.txt` contains:

```text
apple
banana
cherry
```

and the file `greek.txt` contains:

```text
alpha
beta
gamma
```

To output all the lines in `fruit.txt` and
also output the lines in `greek.txt` after "banana":

```shell
sed -E '/banana/ r greek.txt' fruit.txt
```

This outputs:

```text
apple
banana
alpha
beta
gamma
cherry
```

The `R` command can be used repeatedly with the same file
to print different lines from it.
For example, to interleave lines from `greek.txt`
with lines from `fruit.txt`, use:

```shell
sed -E 'R greek.txt' fruit.txt
```

This outputs:

```text
apple
alpha
banana
beta
cherry
gamma
```

The `w` and `W` commands write the current
contents of the pattern space to a given file.
They are useful in `sed` scripts that
need to produce multiple output files
as opposed to streaming all output to stdout.
If the file already exists, it is truncated.
Otherwise the file is created.

For example, suppose we have the file `dogs.txt`
where each line contains a dog breed followed by a comma
and the size "small", "medium", or "large".
Here are three lines from the file:

```text
Affenpinscher,small
Afghan Hound,large
Airedale Terrier,medium
```

Here is a `sed` command that writes
small dog breed names to the file `small-dogs.txt` and
medium dog breed names to the file `medium-dogs.txt`.
It uses the `-n` option to suppress AutoPrint
since all output is to the files
specified with the `w` command.

```shell
sed -E -n \
  -e 's/^(\w+),small$/\1/ w small-dogs.txt' \
  -e 's/^(\w+),medium$/\1/ w medium-dogs.txt' \
  dogs.txt
```

The `y` command replaces characters in one string
with the corresponding characters in another string.
For example, we can replace
all "A" characters with an apple emoji and
all "B" characters with a banana emoji.

```shell
echo "Apple Banana Berry" | sed -E 'y/AB/🍎🍌/'
```

This outputs:

```text
🍎pple 🍌anana 🍌erry
```

Note that replacement is done globally.
The `y` command does not support the `g` flag like the `s` command does.
It replaces globally by default.

### Control Flow Commands

The following table summarizes the `sed` control flow commands in alphabetical order.

| Command   | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| :_label_  | defines label that can be targeted by `b` and `t` commands             |
| b         | branches to end of `sed` script                                        |
| b _label_ | branches to a label                                                    |
| l         | prints the pattern space in a special format for debugging             |
| n         | reads next line into the pattern space                                 |
| N         | appends next line into the pattern space preceded by a newline         |
| q         | prints the pattern space and quits without processing remaining lines  |
| Q         | quits without printing the pattern space or processing remaining lines |
| t         | branches to end of sed script if substitution was performed            |
| t _label_ | branches to a label if substitution was performed                      |
| T         | branches to end of sed script if substitution was NOT performed        |
| T _label_ | branches to a label if substitution was NOT performed                  |
| z         | clears the pattern space                                               |

There are examples of branching to a label (`b`)
and clearing the pattern space (`z`)
in the "Hold Space Commands" section below.

The `n` command prints the current contents of the pattern space
before reading the next line,
whereas the `N` command does not.
This makes the `N` command useful for gathering
multiple lines of input before processing them
as a single string of text
with newlines between each original line.

The following command replaces all occurrences of consecutive blank lines
in the file `my-input.txt` with a single blank line.
All non-blank lines are printed by AutoPrint.

```script
sed -E -i '/^$/ N; /\n$/ D' my-input.txt
```

The first part, `/^$/ N`, appends blank lines to the pattern space.
Note that the pattern space will be empty after each non-blank line is processed.
The second part, `/\n$/ D`, deletes the first line in the pattern space
if the pattern space ends with a newline character.
This will be the case every time a blank line is read
that follows another blank line.

The Unix `cat` command can also be used to do this.
`cat -s my-input` outputs the same result to stdout.
However, using `>` to redirect the output to the
same file does not work and results in an empty file.
But the output can be directed to a new file.

There are more examples of using the `N` command
in the "Matches That Span Lines" section later.

Suppose the input file `report.txt` contains the following:

```text
This is a report
about dogs.

+--------+----------------------------+
| Name   | Breed                      |
+--------+----------------------------+
| Dasher | Whippet                    |
| Maisey | Treeing Walker Coonhound   |
| Ramsey | Native American Indian Dog |
| Oscar  | German Shorthaired Pointer |
+--------+----------------------------+
Total Dogs: 4

These dogs are owned by Mark
and Tami and their children.
```

To output only the table and the "Total" line we can use:

```shell
sed -E -n '/^\+-/,/^Total/ p' report.txt
```

This prints all line ranges
where the first line starts with "+-"
and the last line starts with "Total".
The `-n` option makes it so
no input lines are printed automatically.

If we only want the first table and
there are a larger number of lines after the "Total" line,
this will evaluate all of them.
We can tell `sed` to stop processing
after the "Total" line is found with the `q` command.

The following script is in the file `report.sed`.

```shell
# Substitute lines that start a table with the
# same text just so we can use the T command
# to determine whether it was matched.
s/^\+-/&/

# If not matched, branch to the end of the script
# which stops processing the current input line.
T

# Print all lines until the "Total" line is reached.
:print
p # prints the pattern space
n # reads next line into the pattern space
s/^Total/&/ # attempts to match "Total" line
T print # branches to label "print" if not matched

p # prints the "Total" line
q # quits script so no more input lines are processed
```

To use this `sed` script enter:

```shell
sed -E -n -f report.sed report.txt
```

### Hold Space Commands

the hold space is not cleared when a new input line
is read into the pattern space.
This allows text to be accumulated across
the processing of multiple input lines.

The following table summarizes the `sed` commands
that work with the hold space.

| Command | Description                                    |
| ------- | ---------------------------------------------- |
| h       | copies the pattern space to the hold space     |
| H       | appends the pattern space to the hold space    |
| g       | copies the hold space to the pattern space     |
| G       | appends the hold space to the pattern space    |
| x       | exchanges the pattern space and the hold space |

Suppose we have input like the following
where some lines end with `\`
which represents a continuation character.

```text
This is \
a sentence.
This one \
is spread \
over even \
more lines.
```

We want to combine all continued lines
and produce output like the following:

```text
This is a sentence.
This one is spread over even more lines.
```

Here is a `sed` script that does this.

```shell
# Replace zero or more spaces followed by a backslash
# at the end of the line with a single space.
s/ *\\$/ /

# Append the line to the hold space.
H

# If the previous substitute command did replace
# something, branch to the end of this script.
t

# If we made it to here, we have found
# the end of a group of continued lines.

# Exchange the pattern space and the hold space so the
# concatenated group of lines is in the pattern space.
x

# Remove all newlines.
s/\n//g

# Print the pattern space.
p

# Clear (zap) the pattern space.
z

# Exchange the pattern space and the hold space
# so the hold space becomes empty.
x
```

If this `sed` script is in the file `combine.sed`,
we can run it on the file `sentences.txt` with:

```shell
sed -E -n -f combine.sed sentences.txt
```

The `-n` flag is needed to disable AutoPrint
since the `sed` script decides when to output the pattern space.

Suppose we have files containing paragraphs
that are separated by lines that are
either empty or only contain spaces and tabs.
We want to output the line number where each paragraph begins,
followed by the text of the paragraph with newlines removed
so that each paragraph is on a single line.

The following `sed` script does this.
It demonstrates the power of `sed`,
but is also crazy complicated!

```script
# For lines that contain at least one word character
# - Exchange the pattern space and the hold space so we
#   can test whether the hold space was empty.
# - If the pattern space is empty
#   - Print the current line number.
#   - Exchange the pattern space and the hold space (swaps them back).
#   - Copy the non-empty input line to the hold space.
#     This is the first line of a new paragraph.
#   - Branch to the label "k" at the end
#     to skip the remaining commands.
# - Otherwise
#   - Exchange the pattern space and the hold space (swaps them back).
#   - Append the non-empty input line to the hold space.
#     This is not the first line of the current paragraph.
/\w/ {x; /^$/ {=; x; h; b k}; x; H; :k}

# For lines that are empty or only contain spaces and tabs
# - Exchange the pattern space and the hold space to
#   get the previous paragraph into the pattern space.
# - Replace all newline characters with a space
#   so the paragraph is on a single line.
# - Print the paragraph.
# - Clear (zap) the pattern space.
# - Exchange the pattern space and the hold space so the hold space becomes empty
#   and is ready to gather lines in the next paragraph.
/^[ \t]*$/ {x; s/\n/ /g; p; z; x}
```

If this `sed` script is in the file `paragraphs.sed`,
we can run it on the file `story.txt` with:

```shell
sed -E -n -f paragraphs.sed story.txt
```

Here is example output:

```text
1
Come and listen to a story about a man named Jed A poor mountaineer, barely kept his family fed, Then one day he was shootin at some food  And up through the ground came a bubblin crude.
6
Oil that is, black gold, Texas tea.
8
Well the first thing you know ol Jed's a millionaire,  Kinfolk said "Jed move away from there"  Said "Californy is the place you ought to be"  So they loaded up the truck and moved to Beverly.
13
Hills, that is. Swimmin pools, movie stars.
16
The Beverly Hillbillies!
18
Well now its time to say good-bye to Jed and all his kin.  And they would like to thank you folks fer kindly droppin in.  You're all invited back a gain to this locality  To have a heapin helpin of their hospitality
23
Hillybilly that is. Set a spell, Take your shoes off.
25
Y'all come back now, y'hear?.
```

## Matches That Span Lines

Suppose we want to replace all occurrences
of "John Smith" with "Jane Doe".
This is easy if the words are always on the same line.
It is tricky if "John" can be at the end of a line
and "Smith" can be at the beginning of the next line.

For example, consider this input:

```text
John Smith is a fine name.
But sometimes John
Smith wishes to have a different name.
It can be tiresome hearing people call out
John Smith, John Smith over and over.

There is more I could say
about John Smith,
but I think that's enough.
```

Here is one way to perform the substitutions:

```script
# Handle the simple case where the words are on the same line.
s/John Smith/Jane Doe/g

# Handle the case where the words are on different lines.
/John$/ N; s/John\nSmith/Jane\nDoe/
```

Assuming the `sed` commands above are in the file
'name-change.sed`, here is a command to use it:

```script
sed -E -i -f name-change.sed my-input.txt
```

Here is another way to do this that works
as long as the entire input fits in memory.

```script
sed -E -i ':a; N; $! ba; s/John([ \n])Smith/Jane\1Doe/g' person-story.txt
```

This begins by creating the label "a".
The `N` command appends the next input line onto the pattern space.
The address `$!` matches every line except the last.
For each of those lines, the `ba` command
branches back to the label "a".
The result is that the entire file is read into the pattern space,
including newlines.
The substitute command at the end is not executed
until the entire file is in the pattern space.
It replaces all occurrences of "John",
followed by a space or newline,
followed by "Smith"
with "Jane", followed by the
same character matched (space or newline),
followed by "Doe".

A slight modification changes the previous `sed` script
so it performs the substitution on one paragraph at a time.
This assumes all paragraphs except the last
are followed by a blank line.

```script
sed -E \
  ':a; N; $ bb; /[^\n]$/ ba; :b; s/John([ \n])Smith/Jane\1Doe/g' \
  person-story.txt
```

This uses two labels, "a" and "b".
When the last line is reached (`$`) it branches to label "b".
This marks the end of the final paragraph.

When the pattern space does not end with a newline,
lines from the current paragraph are still being gathered,
so it branches back to "a" to get another line.

When the pattern space ends with a newline,
this means a blank line was appended to the pattern space
and the end of a paragraph has been reached.

How do we know this is really processing one paragraph at a time?
This is a perfect use for the `=` command which prints
the line number of the input line that was last read.
Temporarily add this as the last command
by appending `; =` to the `sed` script.
It will output `6` and `9`.
`6` is the line number of the blank line after the first paragraph.
`9` is the line number of the last line of the final paragraph.

## JavaScript Function Example

Let's see how `sed` can be used to change
JavaScript function definitions to arrow functions.
The indentation of the functions is not modified.

Here is some sample input:

```js
function helloWorld() {
  console.log('Hello, World!');
}

function helloName(name) {
  console.log(`Hello, ${name}!`);
}

function hello(greeting, name) {
  console.log(`${greeting}, ${name}!`);
}
```

Here is the expected output:

```js
const helloWorld = () => {
  console.log('Hello, World!');
};

const helloName = name => {
  console.log(`Hello, ${name}!`);
};

const hello = (greeting, name) => {
  console.log(`${greeting}, ${name}!`);
};
```

The following is a `sed` script that does this.
Each regular expression begins by matching the following:

- any amount of spaces and tabs anchored to the beginning of the line
- the keyword "function" followed by a space
- the name of the function, captured in a group

After this the regular expressions differ
based on the number of parameters they match.
For zero parameters the remaining pattern matches
a left paren and a right paren.
For one parameter the remaining pattern matches
a left paren, a parameter name, and a right paren.
For more than one parameter the remaining pattern matches
a left paren, a parameter name,
one or more pairs of a comma and parameter name,
and a right paren.

All the regular expressions end by matching
an optional space and an open curly brace.

The substitution expression for each substitute command
begins by outputting the whitespace found at the beginning,
the "const" keyword, a space, the function name,
a space, an equal sign, and a space.

After this the substitution expressions differ
based on the number of parameters matched.
For zero parameters a left and right paren is output.
For one parameter just the parameter name is output.
For more than one parameter a left paren, the parameter list, and a right paren are output.

Finally, a space, the arrow token "=>", a space, and a left curly brace are output.

Whew, that is a lot of detail!
Examine the substitute commands below and
try to match their parts to the descriptions above.

```script
# For functions with no parameters ...
s/^([ \t]*)function (\w+)\(\) ?\{$/\1const \2 = () => {/

# For functions with one parameters ...
s/^([ \t]*)function (\w+)\((\w+)\) ?\{$/\1const \2 = \3 => {/

# For functions with two or more parameters ...
s/^([ \t]*)function (\w+)(\(\w+(, \w+)+\)) ?\{$/\1const \2 = \3 => {/
```

Assuming the `sed` commands above are in the file
`js-fn-to-arrow.sed`, here is a command to use it:

```script
sed -E -i -f js-fn-to-arrow.sed demo.js
```

## `package.json` Example

Let's see how `sed` can be used to add
npm scripts to a `package.json` file.

Here is an example `package.json` file:

```json
{
  "name": "some-app",
  "version": "0.1.0",
  "scripts": {
    "build": "react-scripts build",
    "start": "react-scripts start",
    "test": "react-scripts test"
  },
  "dependencies": {
    "normalize.css": "^8.0.1",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-scripts": "3.0.1"
  }
}
```

Here is a `sed` script that adds three npm scripts
to the "scripts" section of a `package.json` file.
It uses the `sed` append (`a`) command.

```script
/"scripts": \{/ a \
    "format": "prettier --wri\e src/**/*.{js,scss}",\
    "lint": "eslint --cache src/**/*.js",\
    "reinstall": "rm -rf node_modules package-lock.json && npm install",
```

Assuming the `sed` command above is in the file
`package-json.sed`, here is a command to use it:

```script
sed -E -i -f package-json.sed package.json
```

## Conclusion

`sed` is a powerful utility that is a great addition
to the tool belt of any software developer.
There are other ways to accomplish everything `sed` does,
but they may require writing much more code.

Thanks to Charles Sharp, Stephen Veit, and Justin Wilson
for reviewing this article!

Send feedback to mark@objectcomputing.com.
