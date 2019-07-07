# That's What I sed

## Overview

`sed` is a Unix utility that transforms text.
The name is short for "stream editor".
Input comes from a stream of text and
output is an edited version of that text.

TODO: Motive this more!

`sed` is based on the `ed` editor
which was created by Ken Thompson in 1969.
`sed` was created Lee McMahon of Bell Labs in 1973.
Currently the most popular version is GNU sed.
This is available on all major operating systems
including Linux, macOS, and Windows.

Alternatives to sed include the Unix utility `awk`
and nearly any general purpose programming language.

Awk excels at processing record-based text
where each line is thought of as a record
composed of columns with similar formatting,
perhaps separated by spaces or tabs.

General purpose programming languages have the advantage
that they can perform any kind of text transformation.
But the code required is longer than when using sed.

`sed` can perform text transformations in very
compact way, but the code is harder to read.
Also, there are some kinds of text transformations
that are not possible in sed.

Still, it is worthwhile learning sed
for the cases that it handles well.

`sed` can be used on its own, but often it is used
in combination with other Unix utilities such as
`expr`, `head`, `seq`, `tail`, `tr`, and `uniq`.

`sed` makes heavy use of regular expressions.
Having an understanding of those is essential for effectively using `sed`.

## sed Use Cases

Typically `sed` is used to operate on text files
where lines are terminated by a newline character.
While `sed` can operate on binary files, doing this is not typical.

A common use for `sed` is automating the application of the
same kinds of modifications to a large number of input files.
The files may already exist or perhaps they are
created over time and need to modified after each is created.

Another use is making many modifications to a single large file.

`sed` is less helpful when a small number of changes
are needed in a single, small file.
In this case using a text editor is usually sufficient.
This is especially true for editors like Vim
that support macros.

## Installing sed

Most versions of Unix ship with GNU sed.

macOS includes a version of `sed`, but it is not
GNU `sed` and differs from that in some ways.
To install GNU `sed`, first install Homebrew
and then enter `brew install gnu-sed`.
To use this version, use the command `gsed` instead of `sed`.
All the examples in this article show using the `sed` command,
but change this to `gsed` if you are using macOS!

Windows does not include a version of `sed`.
A good source for installing it is
<http://gnuwin32.sourceforge.net/packages/sed.htm>.
See the link "General Installation Instructions".
Another option for Windows is to install "UnxUtils"
from <http://sourceforge.net/projects/unxutils/>.

## Getting Input

The text to be transformed can be provided to `sed` in a file.
A "script" of `sed` commands can also be provided in a file.
The following are equivalent ways to supply these files to `sed`:

- `sed -f my-script.sed my-input.txt`.
- `cat my-input.txt | sed -f my-script.sed`.
- `sed -f my-script.sed < my-input.txt`.

Text can also be provided from the output of another command.
For example, `some-executable | sed -f my-script.sed`.

## Directing Output

By default `sed` sends its output to stdout.

The output can also be redirected to a file.
For example, `sed -f my-script.sed my-input.txt > my-output.txt`.

Alternatively the input file can be modified in place using the `-i` flag.
For example, `sed -i -f my-script.sed my-input.txt`.
This stores intermediate results in a temporary file and
replaces the input file with this at the end of processing.
It's a good idea to make a backup copy of files
before modifying them in place so the changes
can be reverted if they aren't what is expected.

## Regular Expression Review

Readers that are already familiar with regular expressions
should skip to the "Substitute Command" section.

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
This can be avoided by using the `sed` flag `-E` (or `-r`).
It is recommended to always include this flag.

### Wildcards

A dot (".") matches any character.
For example, `/a.c/` matches any text that contains
"a", followed by any character, followed by "c".
See the "Repetition" section ahead for matching
more than one occurrence of any character.

To include a literal period in a regular expression,
escape it with a backslash (`\.`).

### Repetition

The number of times a character, wildcard, or group
is expected to appear in the text defaults to one.
These can be followed by a special character for other options.

- `{n}` means n times.
- `{n,}` means at least n times.
- `{m, n}` means at least m times and not more than n times.
- `?` means zero or one (optional) and is the same as `{0, 1}`.
- `*` means zero or more and is the same as `{0,}`.
- `+` means one or more and is the same as `{1,}`.

For example:

- `x?` matches "" or "x"
- `x*` matches "", "x", "xx", "xxx", and so on
- `x+` matches "x", "xx", "xxx", and so on, but not an empty string

To include a literal question mark, asterisk, or plus in a regular expression,
escape it with a backslash (`\?`, `\*`, and `\+').

### Character Classes

Character classes inside a pattern specify a set of characters
that are allowed at a given position in a pattern.
They are specified inside square brackets.
For example, `[pie]` means that one of "p", "i", or "e" is allowed.

Ranges of characters can described using a dash.
For example, `[a-d]` matches the characters "a", "b", "c", and "d".
Multiple ranges can be specified in a single character class.
For example, `[0-9a-f]` matches any digit
or the lowercase letters "a" through "f".

Character classes can be negated by starting with a caret.
For example, `[^aeiou]` means not a vowel.
and `[^a-f]` means not a lowercase letter from "a" to "f".

Sometimes the best way to match characters between two delimiters
is to match the starting delimiter,
followed by characters that are not the ending delimiter,
followed by the ending delimiter.
For example, to match zero or more characters surrounded by parentheses,
use `\([^)]*\)`.
Note that parentheses outside the character class
must escaped with a backslash,
but parentheses inside a character class are not.

TODO: You emailed Charles about this.
The `?`, `*`, and `+` repetition characters are greedy.
This means they match as many consecutive characters as possible.
Suppose we want to match an underscore followed by
any other characters and another underscore.
THE NEXT PART IS WRONG!
The regular expression `/_.*_/` will not work because `.*` will match
the ending underscore and then there won't be another one to match.
Instead of looking for any characters after the starting underscore,
we need to look for any characters except an underscore
using `/_[^_]*_/`.

Predefined character sets have a more compact syntax.
For example, `\w` is a "word character" and
has the same meaning as `[A-Za-z0-9_]`.
`\W` means not a word character.
Note that a hyphen or dash ("-") is not a word character.

Other tools that support regular expressions often recognize
additional predefined character sets such as `\d` for digits,
but `sed` only supports `\w` and `\W`.

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
Those can be used instead.

To include literal square brackets in a regular expression,
escape them with a backslash (`\[` and `\]`).

### Grouping and Back References

Parts of a pattern enclosed in parentheses form a group.
Matching text is captured and can be used later via back references
in the pattern or in a replacement value.
A back reference is a backslash followed by a single digit.

The example below looks for three digits,
followed by one or more other characters,
followed by the same three digits.
In place of outputting all of this it outputs "found".

```script
echo "123mark123" | sed -E 's/([0-9]{3}).+\1/found/'
```

The "back reference" `\1` refers to the first group in the
regular expression, `\2` refers to the second, and so on.

The repetition characters `?`, `*`, and `+` can be applied to groups.

To include literal parentheses in a regular expression,
escape them with a backslash (`\(` and `\)`).

### Anchors

By default regular expressions match any text that contains matching text.
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
When`^`is not the first character in a regular expression
or `\$` is not the last character, they are interpreted literally
and do not need to be escaped.

These can be combined to find blank lines
by matching `/^$/`.

### Alternatives

The `|` character allows specifying more than one pattern to match.

For example, `/abc|def|ghi/` matches text containing
"abc", "def", or "ghi".
The patterns before and after the `|` can be any kind
of regular expression pattern, not just literal text.

### Regular Expression Flags

Commonly used flags include the following:

- `g` for global matching, not just first match
- `i` for case-insensitive (ignore case) matching

### Regular Expression Examples

This regular expression matches text that contains a phone number in the format `(999)999-9999`.

```script
/\(\d{3}\)\d{3}-\d{4}/
```

The parentheses are escaped with a backslash so they are not interpreted as grouping.

TODO: Need more examples?

## Two `sed` Buffers

Text read by `sed` is temporarily stored in two buffers
referred to as "PatSpace" and "HoldSpace".

In normal operation `sed` reads each input line into PatSpace
one at a time and run one or more `sed` commands on this text.
Most `sed` commands only operate on PatSpace.

Usage of HoldSpace will be discussed later.

## Substitute Command

Substitute (`s`) is the most commonly used `sed` command.
It specifies a regular expression that identifies text to match
and a substitution expression that specifies its replacement
(called "SubEx" in some documentation).

These expressions are typically delimited by slash characters ("/"),
but other delimiter characters such as ":", "|", and "\_" can also be used.
If the delimiter occurs in a regular expression,
it must escaped by preceding it with a backslash.

Here is an example that changes the word "red" to "blue"
and the number 1 to the word "one" in each input line.

```script
sed 's/red/blue/; s/1/one/' input.txt
```

Note how multiple `sed` commands (substitute in this case) are separated by semicolons.
Semicolons can optionally be followed by a space for readability.

Another way to write this is to use the `-e` option multiple times.

```script
sed -e 's/red/blue/' -e 's/1/one/' input.txt
```

However, the former approach of placing all the `sed` commands
in a single string and not using the `-e` option is typically preferred.

Each substitute command uses three delimiters,
one at the beginning, one at the end,
and one separating the two expressions.

There are two potential issues with the regular expressions above.

The first issue is that they only replace the first match
in each input line.
To replace all matches we need to add the `g` (global) flag.

The second issue is that they match any text that contains a match,
but do not require matching complete words.
For example, `/red/` matches "red", "Fred", and "redder".
Sometimes this is what is desired.
When it is not we can fix it by using word boundary markers.
The beginning of a word is indicated with `\<` or `\b`.
The end of a word is indicated with `\>` or `\b`.
`\B` represents a position that is not a word boundary.

```script
sed -s '/\bred\b/blue/g; s/\b1\b/one/g' input.txt
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

`seq 3 | sed -E 's/[0-9]+/score: &/'`
outputs the lines "score: 1", "score: 2", and "score: 3".

`echo "mark volkmann" | sed -E 's/(\w+) (\w+)/\u\1 \U\2/'`
outputs "Mark VOLKMANN".

`echo "mARK vOLKMANN" | sed -E 's/(\w)(\w*) (\w)(\w*)/\u\1\L\2\E \u\3\L\4/'`
outputs "Mark Volkmann". In fact, it has the
same output regardless of the case in the input text.

### Substitute Command Flags

Here's a summary of the flags supported by the `s` command
that follow the last delimiter.

| `s` flag        | Description                                          |
| --------------- | ---------------------------------------------------- |
| a number        | changes a specific match (ex. 2 for only the second) |
| `g`             | substitutes global                                   |
| `i`             | ignores case                                         |
| `m`             | enables multiline mode                               |
| `e`             | executes replacement as a shell command if matched   |
| `p`             | prints replacement if matched                        |
| `w {file-path}` | writes replacement to the file if matched            |

Any number of these flags can be combined.
If the `w` flag is used, it must come last
because it is followed by a file path.

If a number is specified along with the g flag
then matching starts at that occurrence number.
For example, `s/foo/bar/3g` replaces all occurrences of
"foo" with "bar" starting with the third occurrence.

### Multiline Mode

In multiline mode:

- `^` matches the start of each line.
- `$` matches the end of each line.
- `` ` `` matches the start of the first line.
- `'` matches the end of the last line.

This is useful in combination with the `N` command
which appends a newline and the next input line to PatSpace.

When not in multiline mode, `` ` `` is the same as `^`
and `'` is the same as `$`, but `^` and `$` are preferred.

The `e`, `p`, and `w` flags are typically used in combination
with the `sed` `-n` option which suppresses the default output.

The `e` flag can be used to process input that contains file paths
and form/execute shell commands that operate on those files.
There is an example like this later in the "Less Common Commands" section
when the `e` command is discussed.

## sed Scripts

`sed` scripts are code that is provided to the `sed` command
that specifies the edits to be performed.
This is done with one or more strings and files,
but typically only one is used.

Multiple string scripts are provided using the `-e` option.
File scripts are provided using the `-f` option.
Any number of each can be specified.
Each of these options appends sed commands to the list of commands to be evaluated
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
Note that each `sed` command is either on a separate line
or separated from the previous command by a semicolon.

```script
s/\bred\b/blue/g
s/\b1\b/one/g
```

Pound signs (`#`) in script files mark the beginning
of a comment that extends to the end of the line.

The script file can be used as follows:

```script
sed -f my-changes.sed input.txt
```

## sed Commands

`sed` scripts are composed of `sed` commands.
When specified on the command-line each command
is separated from the previous one by a semi-colon.

`sed` commands have single-letter names.
For example, `s` is the substitute command.

The default mode for executing `sed` scripts does the following:

```text
for each line of input ...
  read the line into PatSpace, replacing previous contents
  remove newline at end
  for each `sed` script
    for each command in the `sed` script
      if the command has no address or the address matches the line
        process the command on PatSpace
  add newline at end of PatSpace
  AutoPrint contents of PatSpace
```

By default the contents of PatSpace are written to stdout
at the end of each `sed` script.
This is referred to as "AutoPrint".
The `sed` option `-n` disables this.

`sed` commands operate on PatSpace or HoldSpace
which are populated from the input stream.
They do not operate directly on the input stream.
This is good because PatSpace and HoldSpace can be modified
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
We'll see an example like this in the "HoldSpace Commands" section later.

## sed Addresses

A `sed` command can optionally be preceded by an "address"
that describes the input lines for which the command should be run.
When no address is specified, the command is run on all input lines.

Addresses are frequently used to identify lines on which
substitutions will be made or lines that will be deleted.

There are many kinds of supported addresses including:

- a line number  
  For example, `7` runs only on line 7.

- a range of line numbers (referred to as L,H for low to high)  
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
  If no line starting with line 7 matches the regular expression,
  the command is run on all remaining lines.

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

## sed Command Summary

### Common Commands

The following table summarizes the most commonly used sed commands.

| Command                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| a _text_                  | appends _text_ after normal output           |
| c _text_                  | changes normal output to _text_              |
| d                         | deletes PatSpace (clears it)                 |
| D                         | deletes the first line in PatSpace           |
| i _text_                  | inserts _text_ before normal output          |
| s/_regex_/_subex_/_flags_ | substitutes text in line with different text |

_subex_ is short for "substitution expression".

The `d` command causes an input line to not be output,
deleting it.

The `D` command is useful when multiple input lines
have been read into PatSpace.
One way to do this is with the `N` command described later.

The commands `a`, `c`, and `i` are related.
They all provided a way to output arbitrary text.
It can be output before (`a`), after (`i`),
or in place of (`c`) the normal output.

The arbitrary text cannot be edited by subsequent `sed` commands.

In the examples that follow for the `a`, `c`, and `i` commands
a regular expression address (`/foo/`) is used.

The `a` command holds the specified text until the current script finishes
or the `n` or `N` command is used to read the next line of input.
For example, `/foo/ a bar baz` appends the line "bar baz"
after every line that contains "foo".

The `i` command immediately outputs the specified text
and continues with the current script processing.
For example, `/foo/ i bar baz` inserts the line "bar baz"
before every line that contains "foo".

The `c` command deletes PatSpace, skips the remainder of the current script,
and outputs the specified text.
For example, `/foo/ c bar baz` changes every line that contains "foo"
to the line "bar baz".

Multiple lines of new text can provided in two ways.
The first is by separating them with `\n`.
The second is by separating them with a backslash and an actual newline character.

The following two `sed` commands change every line that contains "alpha"
to the lines "beta", "gamma", and "delta" and are equivalent:

```script
/alpha/ c beta\ngamma\ndelta

/alpha/ c beta\
gamma\
delta`
```

We explored the `s` command earlier.

### Less Common Commands

The following table summarizes less commonly used sed commands.

| Command  | Description                                                  |
| -------- | ------------------------------------------------------------ |
| =        | prints current line number followed by a newline             |
| e        | executes PatSpace as a shell command                         |
| p        | prints PatSpace (useful when AutoPrint is off)               |
| P        | prints only the first line (up to newline) in PatSpace       |
| r {file} | reads content of a file and prints it                        |
| R {file} | reads and prints the next line of a file                     |
| w {file} | appends PatSpace to given file                               |
| W {file} | appends first line (up to newline) of PatSpace to given file |
| y        | replaces given characters with others (transliterates)       |

The `=` is mostly useful for debugging `sed` scripts.

The `e` command expects the contents of PatSpace to be a shell command
and executes it. For example, suppose we have an
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

The `p` command outputs the current value of PatSpace.
It is especially useful in conjunction with the `-n` option
which disables AutoPrint. This allows multi-command `sed` scripts
to decide whether and how many times to output PatSpace.

The `P` command is similar, but only outputs the first line of PatSpace.
It is useful in `sed` scripts that read more than one input line.

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
contents of PatSpace to a given file.
They are useful in `sed` scripts that
need to produce multiple output files,
not just direct stdout to a single file.
If the file already exists, its content is deleted.
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
It uses the `-n` flag to suppress AutoPrint since all output
is to the files specified with the `w` command.

```shell
sed -E -n \
  -e 's/^(\w+),small$/\1/ w small-dogs.txt' \
  -e 's/^(\w+),medium$/\1/ w medium-dogs.txt' \
  dogs.txt
```

The `y` command replaces characters in one string
with the corresponding characters in another string.
For example, we can replace "A" characters with an apple emoji
and all "B" characters with a banana emoji.

```shell
echo "Apple Banana Cherry" | sed -E 'y/AB/🍎🍌/'
```

This outputs:

```text
🍎pple 🍌anana Cherry
```

### Logic-Related Commands

The following table summarizes commands that support logic in `sed` scripts.

| Command   | Description                                                  |
| --------- | ------------------------------------------------------------ |
| :_label_  | defines label that can be targeted by `b` and `t` commands   |
| b         | branches to end of script                                    |
| b _label_ | branches to a label                                          |
| l         | prints PatSpace in a special format for debugging            |
| n         | reads next line into PatSpace                                |
| N         | appends next line into PatSpace preceded by a newline        |
| q         | prints PatSpace and quits without processing remaining lines |
| Q         | quits without processing remaining lines                     |
| t         | branches to end of script if substitution was performed      |
| t _label_ | branches to a label if substitution was performed            |
| T         | branches to end of script if substitution was NOT performed  |
| T _label_ | branches to a label if substitution was NOT performed        |
| z         | clears PatSpace                                              |

There are examples of branching to a label (`b`)
and clearing PatSpace (`z`) in the next section.

Suppose the input file `report.txt` contains the following:

```text
This is a report
about dogs.

+--------+---------+
| Name   | Breed   |
+--------+---------+
| Dasher | Whippet |
| Maisey | TWCH    |
| Ramsey | NAID    |
| Oscar  | GSP     |
+--------+---------+
Total Dogs: 4

These dogs are owned by Mark
and Tami and their children.
```

To output only the table and the "Total" line we can use:

```shell
sed -E '/^\+-/,/^Total/ p; d' report.txt
```

This prints all line ranges where the first line starts with "+-"
and the last line starts with "Total".
It deletes all other lines.

If there were a larger number of lines after the "Total" line,
this would evaluate all of them. We can tell `sed` to stop
processing after the "Total" line is found with the `q` command.

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
p # prints PatSpace
n # reads next line into PatSpace
s/^Total/&/ # attempts to match "Total" line
T print # branches to "print" label if not matched

p # prints the "Total" line
q # quits script so no more input lines are processed
```

To use this `sed` script enter:

```shell
sed -E -n -f report.sed report.txt
```

HoldSpace is not cleared when a new input line is read into PatSpace.
This allows text to be accumulated across
the processing of multiple input lines.

The following table summarizes sed commands that work with HoldSpace.

| Command | Description                      |
| ------- | -------------------------------- |
| h       | copies PatSpace to HoldSpace     |
| H       | appends PatSpace to HoldSpace    |
| g       | copies HoldSpace to PatSpace     |
| G       | appends HoldSpace to PatSpace    |
| x       | exchanges PatSpace and HoldSpace |

Here is an example `sed` script that combines lines that
end with the continuation character backslash (`\`).
It reads lines like these:

```text
This is \
a sentence.
This one \
is spread \
over even \
more lines.
```

and produces output like this:

```text
This is a sentence.
This one is spread over even more lines.
```

```shell
# Replace zero or more spaces followed by a backslash
# at the end of the line with a single space.
s/ *\\$/ /

# Append the line to HoldSpace.
H

# If the previous substitute command did replace
# something, branch to the end of this script.
t

# If we made it to here, we have found
# the end of a group of continued lines.

# Exchange PatSpace and HoldSpace so the
# concatenated group of lines is in PatSpace.
x

# Remove all newlines.
s/\n//g

# Print PatSpace.
p

# Clear (zap) PatSpace.
z

# Exchange PatSpace and HoldSpace
# so HoldSpace becomes empty.
x
```

Here is another example `sed` script.
It reads a file containing paragraphs that are separated by lines
that are either empty or only contain spaces and tabs.
It outlines the line number where each paragraph begins,
followed by the text of the paragraph with newlines removed
so each paragraph is on a single line.

This demonstrates the power of `sed`,
but is also crazy complicated!

```script
# For lines that contain at least one word character
# - Exchange PatSpace and HoldSpace so we
#   can test whether HoldSpace was empty.
# - If PatSpace is empty
#   - Print the current line number.
#   - Exchange PatSpace and HoldSpace (swaps them back).
#   - Copy the non-empty input line to HoldSpace.
#     This is the first line of a new paragraph.
#   - Branch to the label "k" at the end
#     to skip the remaining commands.
# - Otherwise
#   - Exchange PatSpace and HoldSpace (swaps them back).
#   - Append the non-empty input line to HoldSpace.
#     This is not the first line of the current paragraph.
/\w/ {x; /^$/ {=; x; h; b k}; x; H; :k}

# For lines that are empty or only contain spaces and tabs
# - Exchange PatSpace and HoldSpace to
#   get the previous paragraph into PatSpace.
# - Replace all newline characters with a space
#   so the paragraph is on a single line.
# - Print the paragraph.
# - Clear (zap) PatSpace.
# - Exchange PatSpace and HoldSpace so HoldSpace becomes empty
#   and is ready to gather lines in the next paragraph.
/^[ \t]*$/ {x; s/\n/ /g; p; z; x}
```

If this `sed` script is in the file `paragraphs.txt`,
we can run it on the file `story.txt` with:

```shell
sed -E -n -f paragraphs.sed story.txt
```

The `-n` flag is needed to disable AutoPrint
since the `sed` script decides when to output PatSpace.

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

## sed Command Line Options Summary

| Option                        | Description                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| -e or --expression {script}   | value is `sed` script to run                                 |
| -f or --file {script-file}    | path to file containing `sed` script                         |
| -h or --help                  | summarizes command line options (enter `man sed` for more)   |
| -i or --in-place              | edit file from `-f` inline                                   |
| -i or --in-place {suffix}     | specifies backup file suffix                                 |
| -n or --quiet or --silent     | turns off AutoPrint                                          |
| -E or -r or --regexp-extended | allows fewer backslashes in regular expressions              |
| -s or --separate              | treats multiple input files as separate streams              |
| --version                     | outputs `sed` version, copyright, license, authors, and more |

The -f option can be used multiple times to read from multiple files.

Other options rarely needed include `-b` or `--binary`,
`--follow-symlinks`, `-l` or `--line-length`,
`--posix`, and `-u` or `--unbuffered`.

## Matches That Span Lines

Suppose we want to replace all occurrences of "John Smith" with "Jane Doe".
This is easy if the words are always on the same line.
It's more tricky if "John" can be at the end of a line
and "Smith" can be at the beginning of the next line.

For example, consider this input:

```text
John Smith is a fine name.
But sometimes John
Smith wishes to have a different name.
I can be tiresome hearing people call out
John Smith, John Smith over and over.
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
- keyword "function" followed by a space
- the name of the function, captured in the group

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

Whew! That's a lot of detail! Examine the substitute commands below
and try to match their parts to the descriptions above.

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

Here's an example `package.json` file:

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
